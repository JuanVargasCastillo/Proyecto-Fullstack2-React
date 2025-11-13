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
import com.tiendavirtual.projectbackend.entities.Users;
import com.tiendavirtual.projectbackend.repositories.BoletaDetalleRepository;
import com.tiendavirtual.projectbackend.repositories.BoletaRepository;
import com.tiendavirtual.projectbackend.repositories.CarritoItemRepository;
import com.tiendavirtual.projectbackend.repositories.CarritoRepository;

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

    @Transactional
    public Boleta generarBoleta(Users usuario) {
        Carrito carrito = carritoRepository.findByUsuarioAndActivoTrue(usuario)
                .orElseThrow(() -> new IllegalStateException("No existe carrito activo para el usuario"));

        List<CarritoItem> items = carritoItemRepository.findByCarritoId(carrito.getId());
        if (items.isEmpty()) {
            throw new IllegalStateException("El carrito está vacío");
        }

        double subtotal = items.stream()
                .mapToDouble(i -> i.getPrecioUnitario() * i.getCantidad())
                .sum();
        double neto = subtotal;
        double iva = round2(neto * IVA_RATE);
        double total = round2(neto + iva);

        Boleta boleta = new Boleta();
        boleta.setUsuario(usuario);
        boleta.setSubtotal(round2(subtotal));
        boleta.setNeto(round2(neto));
        boleta.setIva(iva);
        boleta.setTotal(total);
        boleta.setCreadoEn(Instant.now());
        boleta = boletaRepository.save(boleta);
        // Numeración correlativa simple: igualar al ID autogenerado
        boleta.setCorrelativo(boleta.getId());
        boleta = boletaRepository.save(boleta);

        for (CarritoItem ci : items) {
            BoletaDetalle bd = new BoletaDetalle();
            bd.setBoleta(boleta);
            bd.setProducto(ci.getProducto());
            bd.setCantidad(ci.getCantidad());
            bd.setPrecioUnitario(ci.getPrecioUnitario());
            bd.setTotalLinea(round2(ci.getPrecioUnitario() * ci.getCantidad()));
            boletaDetalleRepository.save(bd);
        }

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
}