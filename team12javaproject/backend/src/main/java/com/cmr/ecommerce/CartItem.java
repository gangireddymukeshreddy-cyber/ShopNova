package com.cmr.ecommerce;
public class CartItem {
 private Product product; private int quantity;
 public CartItem(){} public CartItem(Product p,int q){product=p;quantity=q;}
 public Product getProduct(){return product;} public void setProduct(Product p){product=p;}
 public int getQuantity(){return quantity;} public void setQuantity(int q){quantity=q;}
 public double getSubtotal(){return product.getPrice()*quantity;}
}