package com.cmr.ecommerce;
import java.util.Objects;
public class Product {
 private String id,name; private double price;
 public Product(){} public Product(String id,String name,double price){this.id=id;this.name=name;this.price=price;}
 public String getId(){return id;} public void setId(String v){id=v;}
 public String getName(){return name;} public void setName(String v){name=v;}
 public double getPrice(){return price;} public void setPrice(double v){price=v;}
 public boolean equals(Object o){if(this==o)return true;if(!(o instanceof Product))return false;return Objects.equals(id,((Product)o).id);}
 public int hashCode(){return Objects.hash(id);}
}