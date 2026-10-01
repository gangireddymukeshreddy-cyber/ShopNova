package com.cmr.ecommerce;
import java.util.*; import org.springframework.stereotype.Service;
@Service public class ShoppingCart {
 private final Map<Product,Integer> cartMap=new HashMap<>();
 public void addProduct(Product p,int q){if(q<=0)throw new IllegalArgumentException("Quantity must be greater than 0.");cartMap.put(p,cartMap.getOrDefault(p,0)+q);}
 public void updateQuantity(Product p,int q){if(!cartMap.containsKey(p))throw new IllegalArgumentException("Product not found in cart.");if(q<=0)removeProduct(p);else cartMap.put(p,q);}
 public void removeProduct(Product p){cartMap.remove(p);}
 public List<CartItem> getCartItems(){List<CartItem> a=new ArrayList<>();for(Map.Entry<Product,Integer> e:cartMap.entrySet())a.add(new CartItem(e.getKey(),e.getValue()));return a;}
 public double calculateTotal(){double t=0;for(Map.Entry<Product,Integer> e:cartMap.entrySet())t+=e.getKey().getPrice()*e.getValue();return t;}
 public int getItemCount(){return cartMap.values().stream().mapToInt(Integer::intValue).sum();}
 public void clear(){cartMap.clear();}
}