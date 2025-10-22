package com.tiendavirtual.projectbackend.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.tiendavirtual.projectbackend.entities.Producto;
import com.tiendavirtual.projectbackend.repositories.ProductoRepositories;

public class ProductoServiceTest {

    @Mock
    private ProductoRepositories productoRepositories;

    @InjectMocks
    private ProductoServicesImpl productoServices;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldCreateProductAndReturnEntity() {
        Producto producto = new Producto();
        producto.setNombre("Polera Vintage");
        producto.setDescripcion("Polera de algodón vintage años 90, excelente estado");
        producto.setPrecio(BigDecimal.valueOf(15000));
        producto.setStock(8);

        when(productoRepositories.save(any(Producto.class))).thenAnswer(invocation -> {
            Producto p = invocation.getArgument(0);
            p.setId(1L);
            return p;
        });

        Producto created = productoServices.crear(producto);

        verify(productoRepositories, times(1)).save(any(Producto.class));
        assertNotNull(created.getId());
        assertEquals("Polera Vintage", created.getNombre());
        assertEquals(BigDecimal.valueOf(15000), created.getPrecio());
        assertEquals(8, created.getStock());
    }

    @Test
    void shouldListAllProductsFromRepository() {
        Producto polera = new Producto();
        polera.setId(1L);
        polera.setNombre("Polera Vintage");

        Producto pantalon = new Producto();
        pantalon.setId(2L);
        pantalon.setNombre("Pantalón Denim");

        Producto chaqueta = new Producto();
        chaqueta.setId(3L);
        chaqueta.setNombre("Chaqueta Retro");

        List<Producto> productos = Arrays.asList(polera, pantalon, chaqueta);

        when(productoRepositories.findAll()).thenReturn(productos);

        List<Producto> result = productoServices.listarTodas();

        verify(productoRepositories, times(1)).findAll();
        assertEquals(3, result.size());
        assertEquals("Polera Vintage", result.get(0).getNombre());
        assertEquals("Pantalón Denim", result.get(1).getNombre());
        assertEquals("Chaqueta Retro", result.get(2).getNombre());
    }

    @Test
    void shouldListLowStockProductsUsingThreshold() {
        Producto vestido = new Producto();
        vestido.setId(10L);
        vestido.setNombre("Vestido Bohemio");
        vestido.setStock(2);

        Producto falda = new Producto();
        falda.setId(11L);
        falda.setNombre("Falda Plisada");
        falda.setStock(1);

        List<Producto> stockBajo = Arrays.asList(vestido, falda);

        when(productoRepositories.findByStockLessThan(3)).thenReturn(stockBajo);

        List<Producto> result = productoServices.listarStockBajo(3);

        verify(productoRepositories, times(1)).findByStockLessThan(3);
        assertEquals(2, result.size());
        assertTrue(result.stream().allMatch(p -> p.getStock() < 3));
        assertEquals("Vestido Bohemio", result.get(0).getNombre());
        assertEquals("Falda Plisada", result.get(1).getNombre());
    }

    @Test
    void shouldThrowWhenDeletingNonexistentProduct() {
        Long productId = 999L;

        when(productoRepositories.existsById(productId)).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            productoServices.eliminar(productId);
        });

        assertEquals("Producto no encontrado", exception.getMessage());
        verify(productoRepositories, times(1)).existsById(productId);
        verify(productoRepositories, never()).deleteById(anyLong());
    }
}