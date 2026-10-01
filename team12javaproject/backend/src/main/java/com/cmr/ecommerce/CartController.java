package com.cmr.ecommerce;
import java.util.*; import org.springframework.http.*; import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api") @CrossOrigin(origins="*")
public class CartController {
 private final ProductCatalog catalog; private final ShoppingCart cart;
 public CartController(ProductCatalog c,ShoppingCart s){catalog=c;cart=s;}
 @GetMapping("/products") public Collection<Product> products(){return catalog.displayProducts();}
 @GetMapping("/cart") public Map<String,Object> cart(){return data();}
 @PostMapping("/cart/add") public ResponseEntity<?> add(@RequestParam String productId,@RequestParam(defaultValue="1") int quantity){
  Product p=catalog.findProduct(productId); if(p==null)return bad("Product ID not found.");
  try{cart.addProduct(p,quantity);return ResponseEntity.ok(data());}catch(Exception e){return bad(e.getMessage());}}
 @PutMapping("/cart/update") public ResponseEntity<?> update(@RequestParam String productId,@RequestParam int quantity){
  Product p=catalog.findProduct(productId); if(p==null)return bad("Product ID not found.");
  try{cart.updateQuantity(p,quantity);return ResponseEntity.ok(data());}catch(Exception e){return bad(e.getMessage());}}
 @DeleteMapping("/cart/remove/{id}") public ResponseEntity<?> remove(@PathVariable String id){
  Product p=catalog.findProduct(id);if(p==null)return bad("Product ID not found.");cart.removeProduct(p);return ResponseEntity.ok(data());}
 @DeleteMapping("/cart/clear") public Map<String,Object> clear(){cart.clear();return data();}
 @PostMapping("/order/confirm") public ResponseEntity<?> confirm(){if(cart.getItemCount()==0)return bad("Your cart is empty.");double total=cart.calculateTotal();cart.clear();return ResponseEntity.ok(Map.of("message","Order confirmed successfully.","total",total));}
 private ResponseEntity<Map<String,String>> bad(String m){return ResponseEntity.badRequest().body(Map.of("message",m));}
 private Map<String,Object> data(){return Map.of("items",cart.getCartItems(),"itemCount",cart.getItemCount(),"total",cart.calculateTotal());}
}