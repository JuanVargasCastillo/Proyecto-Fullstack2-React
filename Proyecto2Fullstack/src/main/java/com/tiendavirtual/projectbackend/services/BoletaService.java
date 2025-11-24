package com.tiendavirtual.projectbackend.services;

import java.time.Instant;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tiendavirtual.projectbackend.entities.Boleta;
import com.tiendavirtual.projectbackend.entities.BoletaDetalle;
import com.tiendavirtual.projectbackend.entities.Carrito;
import com.tiendavirtual.projectbackend.entities.CarritoItem;
import com.tiendavirtual.projectbackend.entities.Envio;
import com.tiendavirtual.projectbackend.entities.Users;
import com.tiendavirtual.projectbackend.dto.EnvioRequest;
import com.tiendavirtual.projectbackend.repositories.BoletaDetalleRepository;
import com.tiendavirtual.projectbackend.repositories.BoletaRepository;
import com.tiendavirtual.projectbackend.repositories.CarritoItemRepository;
import com.tiendavirtual.projectbackend.repositories.CarritoRepository;
import com.tiendavirtual.projectbackend.repositories.EnvioRepository;
import com.tiendavirtual.projectbackend.repositories.ProductoRepository;

@Service
public class BoletaService {

    private static final double IVA_RATE = 0.19; // 19%

    @Autowired
    private CarritoRepository carritoRepository;

    @Autowired
    private CarritoItemRepository carritoItemRepository;

    @Autowired
    private BoletaRepository boletaRepository;

    @Autowired
    private BoletaDetalleRepository boletaDetalleRepository;

    @Autowired
    private EnvioRepository envioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Transactional
    public Boleta generarBoleta(Users usuario, EnvioRequest envioReq) {
        Carrito carrito = carritoRepository.findByUsuarioAndActivoTrue(usuario)
                .orElseThrow(() -> new IllegalStateException("No existe carrito activo para el usuario"));

        List<CarritoItem> items = carritoItemRepository.findByCarritoId(carrito.getId());
        if (items.isEmpty()) {
            throw new IllegalStateException("El carrito está vacío");
        }

        double totalProductos = items.stream()
                .mapToDouble(i -> i.getPrecioUnitario() * i.getCantidad())
                .sum();
        String codigo = envioReq.getCodigoCupon() != null ? envioReq.getCodigoCupon().trim().toUpperCase() : null;
        double rate = ("CLUB10".equals(codigo)) ? 0.10 : ("BIENVENIDA5".equals(codigo) ? 0.05 : 0.0);
        double descuento = round2(totalProductos * rate);
        double subtotalConDescuento = round2(totalProductos - descuento);
        double neto = round0(subtotalConDescuento / 1.19);
        double iva = round0(subtotalConDescuento - neto);
        double costoEnvio = subtotalConDescuento > 20000 ? 0.0 : 3000.0;
        double total = round0(subtotalConDescuento + costoEnvio);

        Boleta boleta = new Boleta();
        boleta.setUsuario(usuario);
        boleta.setSubtotal(subtotalConDescuento);
        boleta.setDescuento(descuento);
        boleta.setNeto(round2(neto));
        boleta.setIva(iva);
        boleta.setTotal(total);
        boleta.setCostoEnvio(costoEnvio);
        boleta.setCodigoCupon(codigo);
        boleta.setCreadoEn(Instant.now());
        boleta = boletaRepository.save(boleta);
        // Numeración correlativa simple: igualar al ID autogenerado
        boleta.setCorrelativo(boleta.getId());
        boleta = boletaRepository.save(boleta);

        for (CarritoItem ci : items) {
            if (ci.getProducto().getStock() < ci.getCantidad()) {
                throw new IllegalArgumentException("stockInsuficiente: No hay stock suficiente para este producto");
            }
            ci.getProducto().setStock(ci.getProducto().getStock() - ci.getCantidad());
            productoRepository.save(ci.getProducto());
            BoletaDetalle bd = new BoletaDetalle();
            bd.setBoleta(boleta);
            bd.setProducto(ci.getProducto());
            bd.setCantidad(ci.getCantidad());
            bd.setPrecioUnitario(ci.getPrecioUnitario());
            bd.setTotalLinea(round2(ci.getPrecioUnitario() * ci.getCantidad()));
            boletaDetalleRepository.save(bd);
        }

        Envio envio = new Envio();
        envio.setBoleta(boleta);
        envio.setNombre(envioReq.getNombre());
        envio.setApellidos(envioReq.getApellidos());
        envio.setCorreo(envioReq.getCorreo());
        envio.setCalle(envioReq.getCalle());
        envio.setDepartamento(envioReq.getDepartamento());
        envio.setRegion(envioReq.getRegion());
        envio.setComuna(envioReq.getComuna());
        envio.setIndicacionesEntrega(envioReq.getIndicacionesEntrega());
        envio.setCostoEnvio(costoEnvio);
        envioRepository.save(envio);
        boleta.setEnvio(envio);

        // Cerrar carrito activo
        carrito.setActivo(false);
        carritoRepository.save(carrito);

        // Crear nuevo carrito vacío activo para el usuario
        Carrito nuevo = new Carrito();
        nuevo.setUsuario(usuario);
        nuevo.setActivo(true);
        nuevo.setCreadoEn(Instant.now());
        carritoRepository.save(nuevo);

        return boleta;
    }

    @Transactional
    public Boleta generarBoleta(Users usuario) {
        Carrito carrito = carritoRepository.findByUsuarioAndActivoTrue(usuario)
                .orElseThrow(() -> new IllegalStateException("No existe carrito activo para el usuario"));

        List<CarritoItem> items = carritoItemRepository.findByCarritoId(carrito.getId());
        if (items.isEmpty()) {
            throw new IllegalStateException("El carrito está vacío");
        }

        double totalProductos = items.stream()
                .mapToDouble(i -> i.getPrecioUnitario() * i.getCantidad())
                .sum();
        double descuento = 0.0;
        double subtotalConDescuento = round2(totalProductos - descuento);
        double neto = round0(subtotalConDescuento / 1.19);
        double iva = round0(subtotalConDescuento - neto);
        double total = round0(subtotalConDescuento);

        Boleta boleta = new Boleta();
        boleta.setUsuario(usuario);
        boleta.setSubtotal(subtotalConDescuento);
        boleta.setDescuento(descuento);
        boleta.setNeto(round2(neto));
        boleta.setIva(iva);
        boleta.setTotal(total);
        boleta.setCreadoEn(Instant.now());
        boleta = boletaRepository.save(boleta);
        boleta.setCorrelativo(boleta.getId());
        boleta = boletaRepository.save(boleta);

        for (CarritoItem ci : items) {
            if (ci.getProducto().getStock() < ci.getCantidad()) {
                throw new IllegalArgumentException("stockInsuficiente: No hay stock suficiente para este producto");
            }
            ci.getProducto().setStock(ci.getProducto().getStock() - ci.getCantidad());
            productoRepository.save(ci.getProducto());
            BoletaDetalle bd = new BoletaDetalle();
            bd.setBoleta(boleta);
            bd.setProducto(ci.getProducto());
            bd.setCantidad(ci.getCantidad());
            bd.setPrecioUnitario(ci.getPrecioUnitario());
            bd.setTotalLinea(round2(ci.getPrecioUnitario() * ci.getCantidad()));
            boletaDetalleRepository.save(bd);
        }

        carrito.setActivo(false);
        carritoRepository.save(carrito);

        Carrito nuevo = new Carrito();
        nuevo.setUsuario(usuario);
        nuevo.setActivo(true);
        nuevo.setCreadoEn(Instant.now());
        carritoRepository.save(nuevo);

        return boleta;
    }

    @Transactional(readOnly = true)
    public List<Boleta> historialUsuario(Users usuario) {
        return boletaRepository.findByUsuarioOrderByCreadoEnDesc(usuario);
    }

    @Transactional(readOnly = true)
    public Boleta obtenerDetalle(Long id) {
        return boletaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Boleta no encontrada"));
    }

    @Transactional(readOnly = true)
    public List<Boleta> listarTodas() {
        return boletaRepository.findAll()
                .stream()
                .sorted((a, b) -> b.getCreadoEn().compareTo(a.getCreadoEn()))
                .toList();
    }

    private static double round2(double v) {
        return Math.round(v * 100.0) / 100.0;
    }

    private static double round0(double v) {
        return Math.round(v);
    }
}