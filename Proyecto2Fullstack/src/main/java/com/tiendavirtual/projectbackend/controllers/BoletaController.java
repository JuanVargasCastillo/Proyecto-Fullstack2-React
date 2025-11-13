package com.tiendavirtual.projectbackend.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.tiendavirtual.projectbackend.dto.BoletaResponse;
import com.tiendavirtual.projectbackend.entities.Boleta;
import com.tiendavirtual.projectbackend.entities.BoletaDetalle;
import com.tiendavirtual.projectbackend.entities.Users;
import com.tiendavirtual.projectbackend.enums.Rol;
import com.tiendavirtual.projectbackend.services.BoletaService;

@RestController
@RequestMapping("/api")
public class BoletaController {

    @Autowired
    private BoletaService boletaService;

    private Users currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (Users) auth.getPrincipal();
    }

    private BoletaResponse toResponse(Boleta b) {
        BoletaResponse r = new BoletaResponse();
        r.setId(b.getId());
        r.setCorrelativo(b.getCorrelativo());
        r.setSubtotal(b.getSubtotal());
        r.setNeto(b.getNeto());
        r.setIva(b.getIva());
        r.setTotal(b.getTotal());
        r.setCreadoEn(b.getCreadoEn());
        List<BoletaResponse.Detalle> detalles = b.getDetalles().stream().map(d -> {
            BoletaResponse.Detalle rd = new BoletaResponse.Detalle();
            rd.productoId = d.getProducto().getId();
            rd.nombre = d.getProducto().getNombre();
            rd.cantidad = d.getCantidad();
            rd.precioUnitario = d.getPrecioUnitario();
            rd.totalLinea = d.getTotalLinea();
            return rd;
        }).collect(Collectors.toList());
        r.setDetalles(detalles);
        return r;
    }

    @PostMapping("/boletas")
    public ResponseEntity<BoletaResponse> generarBoleta() {
        Users usuario = currentUser();
        Boleta b = boletaService.generarBoleta(usuario);
        return ResponseEntity.ok(toResponse(b));
    }

    @GetMapping("/boletas")
    public ResponseEntity<List<BoletaResponse>> historialUsuario() {
        Users usuario = currentUser();
        List<BoletaResponse> resp = boletaService.historialUsuario(usuario).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/boletas/{id}")
    public ResponseEntity<BoletaResponse> detalle(@PathVariable("id") Long id) {
        Users usuario = currentUser();
        Boleta b = boletaService.obtenerDetalle(id);
        // Permitir si es dueño o SUPER_ADMIN
        Rol rol = usuario.getRol();
        if (!b.getUsuario().getId().equals(usuario.getId()) && (rol == null || rol != Rol.SUPER_ADMIN)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(toResponse(b));
    }

    @GetMapping("/admin/boletas")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<BoletaResponse>> listadoAdmin() {
        List<BoletaResponse> resp = boletaService.listarTodas().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(resp);
    }
}