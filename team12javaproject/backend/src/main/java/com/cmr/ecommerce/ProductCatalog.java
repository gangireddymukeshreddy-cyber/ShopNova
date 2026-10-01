package com.cmr.ecommerce;
import java.util.*; import org.springframework.stereotype.Service;
@Service public class ProductCatalog {
 private final Map<String,Product> products=new HashMap<>();
 public ProductCatalog(){
  addProduct(new Product("P101","Wireless Mouse",25.50));
  addProduct(new Product("P102","Mechanical Keyboard",89.99));
  addProduct(new Product("P103","USB-C Hub",15.00));
 }
 public void addProduct(Product p){products.put(p.getId(),p);}
 public Product findProduct(String id){return products.get(id);}
 public Collection<Product> displayProducts(){return products.values();}
}