package com.tiendavirtual.projectbackend.entities;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

@Entity
@Table(name = "boletas")
public class Boleta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Correlativo secuencial (para simplificar, se iguala al id)
    @Column(unique = true)
    private Long correlativo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Users usuario;

    @OneToMany(mappedBy = "boleta", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<BoletaDetalle> detalles = new ArrayList<>();

    @Column(nullable = false)
    private Double subtotal;

    @Column(nullable = false)
    private Double neto;

    @Column(nullable = false)
    private Double iva;

    @Column(nullable = false)
    private Double total;

    @Column(name = "creado_en", nullable = false)
    private Instant creadoEn = Instant.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCorrelativo() { return correlativo; }
    public void setCorrelativo(Long correlativo) { this.correlativo = correlativo; }

    public Users getUsuario() { return usuario; }
    public void setUsuario(Users usuario) { this.usuario = usuario; }

    public List<BoletaDetalle> getDetalles() { return detalles; }
    public void setDetalles(List<BoletaDetalle> detalles) { this.detalles = detalles; }

    public Double getSubtotal() { return subtotal; }
    public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }

    public Double getNeto() { return neto; }
    public void setNeto(Double neto) { this.neto = neto; }

    public Double getIva() { return iva; }
    public void setIva(Double iva) { this.iva = iva; }

    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }

    public Instant getCreadoEn() { return creadoEn; }
    public void setCreadoEn(Instant creadoEn) { this.creadoEn = creadoEn; }
}