import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Box,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  Coffee,
  Cookie,
  CreditCard,
  Droplets,
  HandCoins,
  MapPin,
  Minus,
  PackageCheck,
  Plus,
  Search,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Store,
  Trash2,
  Truck,
  Utensils,
  X,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

type Category = "All" | "Food" | "Groceries" | "Stationery" | "Essentials";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Exclude<Category, "All">;
  badge?: string;
  icon: LucideIcon;
  artClass: string;
};

type CartItem = Product & { quantity: number };

const products: Product[] = [
  {
    id: 1,
    name: "Chicken rice bowl",
    description: "A warm, filling lunch with seasoned rice, grilled chicken and a fresh side salad.",
    price: 280,
    category: "Food",
    badge: "Popular",
    icon: Utensils,
    artClass: "art-coral",
  },
  {
    id: 2,
    name: "Iced campus coffee",
    description: "Cold-brewed coffee, lightly sweetened and ready for your next study session.",
    price: 140,
    category: "Food",
    badge: "Study fuel",
    icon: Coffee,
    artClass: "art-mustard",
  },
  {
    id: 3,
    name: "Crunch snack box",
    description: "A small mix of biscuits, nuts and a fruit bar for the long afternoon lecture.",
    price: 190,
    category: "Food",
    icon: Cookie,
    artClass: "art-lilac",
  },
  {
    id: 4,
    name: "Fresh water 1.5L",
    description: "Chilled bottled water delivered to your hostel, library or study spot.",
    price: 70,
    category: "Groceries",
    icon: Droplets,
    artClass: "art-blue",
  },
  {
    id: 5,
    name: "Hostel essentials pack",
    description: "Soap, tissue, detergent sachet and toothpaste in one convenient bundle.",
    price: 420,
    category: "Essentials",
    badge: "Best value",
    icon: Box,
    artClass: "art-mint",
  },
  {
    id: 6,
    name: "A4 ruled notebook",
    description: "A sturdy 80-page notebook for lectures, plans, and the ideas in between.",
    price: 160,
    category: "Stationery",
    icon: BookOpen,
    artClass: "art-sky",
  },
  {
    id: 7,
    name: "Black ink pen set",
    description: "Three smooth-writing pens for exams, notes and the last-minute group work.",
    price: 90,
    category: "Stationery",
    icon: Sparkles,
    artClass: "art-peach",
  },
  {
    id: 8,
    name: "Laundry day bundle",
    description: "Washing powder, fabric softener and pegs for a cleaner week on campus.",
    price: 350,
    category: "Essentials",
    icon: PackageCheck,
    artClass: "art-green",
  },
];

const categories: { label: Category; icon: LucideIcon; note: string }[] = [
  { label: "All", icon: ShoppingBag, note: "The full shelf" },
  { label: "Food", icon: Utensils, note: "For right now" },
  { label: "Groceries", icon: Droplets, note: "Keep it stocked" },
  { label: "Stationery", icon: BookOpen, note: "For getting it done" },
  { label: "Essentials", icon: PackageCheck, note: "The useful stuff" },
];

const formatPrice = (value: number) => `KSh ${value.toLocaleString("en-KE")}`;

function ProductArt({ product, small = false }: { product: Product; small?: boolean }) {
  const Icon = product.icon;
  return (
    <div className={`product-art ${product.artClass} ${small ? "product-art-small" : ""}`} aria-hidden="true">
      <Icon strokeWidth={1.5} />
      <span className="art-stamp">CC / {product.category.slice(0, 3).toUpperCase()}</span>
    </div>
  );
}

function QuantityControl({ quantity, onDecrease, onIncrease }: { quantity: number; onDecrease: () => void; onIncrease: () => void }) {
  return (
    <div className="quantity-control" aria-label="Change quantity">
      <button onClick={onDecrease} aria-label="Decrease quantity"><Minus size={13} /></button>
      <span>{quantity}</span>
      <button onClick={onIncrease} aria-label="Increase quantity"><Plus size={13} /></button>
    </div>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem("campuscart-cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [customer, setCustomer] = useState({ name: "", phone: "", location: "", note: "" });

  useEffect(() => {
    localStorage.setItem("campuscart-cart", JSON.stringify(cart));
  }, [cart]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = activeCategory === "All" || product.category === activeCategory;
      const matchesSearch = !query || `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const deliveryFee = cart.length > 0 ? 80 : 0;
  const total = subtotal + deliveryFee;

  const addToCart = (product: Product) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...current, { ...product, quantity: 1 }];
    });
    toast.success(`${product.name} added to your cart`, { description: "You can keep browsing or review your order." });
  };

  const updateQuantity = (id: number, change: number) => {
    setCart((current) => current.flatMap((item) => {
      if (item.id !== id) return [item];
      const nextQuantity = item.quantity + change;
      return nextQuantity > 0 ? [{ ...item, quantity: nextQuantity }] : [];
    }));
  };

  const removeFromCart = (id: number) => setCart((current) => current.filter((item) => item.id !== id));

  const submitOrder = (event: React.FormEvent) => {
    event.preventDefault();
    if (!customer.name || !customer.phone || !customer.location) {
      toast.error("A few details are still needed", { description: "Add your name, phone number and campus location." });
      return;
    }
    setOrderPlaced(true);
    setCart([]);
    setCheckoutOpen(false);
  };

  const scrollToStore = () => document.getElementById("store")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="campuscart-shell">
      <div className="announcement-bar">
        <span className="announcement-dot" />
        <span>Student-friendly prices. One less trip across campus.</span>
        <span className="announcement-link">Delivery from KSh 80</span>
      </div>

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="CampusCart home">
          <span className="wordmark-mark"><ShoppingCart size={17} strokeWidth={2.5} /></span>
          <span>campus<span>cart</span></span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#store">Shop</a>
          <a href="#how-it-works">How it works</a>
          <a href="#business-model">Our model</a>
        </nav>
        <div className="header-actions">
          <div className="search-wrap">
            <Search size={15} />
            <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search the shelf" aria-label="Search products" />
          </div>
          <button className="cart-trigger" onClick={() => setCartOpen(true)} aria-label={`Open cart with ${cartCount} items`}>
            <ShoppingBag size={18} />
            <span>Cart</span>
            <b>{cartCount}</b>
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero-section section-wrap">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> THE CAMPUS MARKETPLACE</div>
            <h1>Your campus run, <em>sorted.</em></h1>
            <p className="hero-lede">Food, groceries and the useful stuff — brought closer to your class, hostel or study spot.</p>
            <div className="hero-actions">
              <Button className="primary-cta" onClick={scrollToStore}>Browse the shelf <ArrowRight size={17} /></Button>
              <a href="#business-model" className="text-cta">See how it works <ChevronRight size={15} /></a>
            </div>
            <div className="hero-proof">
              <div className="avatar-stack" aria-hidden="true"><span>JM</span><span>AK</span><span>+2k</span></div>
              <div><strong>Loved by students</strong><small>Quick orders. Fair prices. No queues.</small></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-note note-one"><Clock3 size={15} /> Usually under 35 min</div>
            <div className="hero-order-card">
              <div className="order-card-top"><span>YOUR NEXT ORDER</span><span className="order-status"><span /> Ready to add</span></div>
              <div className="order-card-title"><span>Something for the study break?</span><Sparkles size={21} /></div>
              <div className="order-preview-item"><div className="mini-art mini-coral"><Utensils size={20} /></div><div><strong>Chicken rice bowl</strong><small>Lunch / Popular pick</small></div><b>KSh 280</b></div>
              <div className="order-preview-item"><div className="mini-art mini-yellow"><Coffee size={20} /></div><div><strong>Iced campus coffee</strong><small>Drinks / Study fuel</small></div><b>KSh 140</b></div>
              <div className="order-card-total"><span>Subtotal</span><b>KSh 420</b></div>
              <button className="order-card-button" onClick={scrollToStore}>Build my order <ArrowRight size={15} /></button>
            </div>
            <div className="hero-note note-two"><MapPin size={15} /> Delivering to campus</div>
            <div className="hero-scribble">made for<br /><strong>real student days</strong></div>
          </div>
        </section>

        <section className="trust-strip" aria-label="CampusCart benefits">
          <div><span className="trust-icon"><Truck size={17} /></span><span><strong>Campus delivery</strong><small>To your study spot</small></span></div>
          <div><span className="trust-icon"><HandCoins size={17} /></span><span><strong>Fair everyday prices</strong><small>Built for student budgets</small></span></div>
          <div><span className="trust-icon"><BadgeCheck size={17} /></span><span><strong>Local vendor picks</strong><small>Good food, closer by</small></span></div>
          <div className="trust-strip-end">No queue. No detour. <em>Just campus life.</em></div>
        </section>

        <section id="store" className="store-section section-wrap">
          <div className="section-heading-row">
            <div><div className="eyebrow"><span className="eyebrow-line" /> THE SHELF</div><h2>What do you need<br /><em>right now?</em></h2></div>
            <div className="section-heading-note">A small, useful selection for the moments that make up a student day.</div>
          </div>

          <div className="category-shelf" role="tablist" aria-label="Product categories">
            {categories.map(({ label, icon: Icon, note }) => (
              <button key={label} role="tab" aria-selected={activeCategory === label} className={`category-tab ${activeCategory === label ? "active" : ""}`} onClick={() => setActiveCategory(label)}>
                <span className="category-icon"><Icon size={19} /></span><span><strong>{label}</strong><small>{note}</small></span><ChevronDown size={14} className="category-chevron" />
              </button>
            ))}
          </div>

          <div className="store-toolbar"><p><strong>{filteredProducts.length}</strong> useful picks <span>·</span> delivered around campus</p><button onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}>Clear filters <X size={13} /></button></div>

          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <article className="product-card" key={product.id}>
                  <button className="product-details-link" onClick={() => setSelectedProduct(product)} aria-label={`View details for ${product.name}`}><ProductArt product={product} />{product.badge && <span className="product-badge">{product.badge}</span>}</button>
                  <div className="product-card-body"><div className="product-meta"><span>{product.category}</span><span>·</span><span>Campus pick</span></div><button className="product-name-button" onClick={() => setSelectedProduct(product)}>{product.name}</button><p>{product.description}</p><div className="product-buy-row"><strong>{formatPrice(product.price)}</strong><div className="product-actions"><button className="view-details-button" onClick={() => setSelectedProduct(product)}>Details <ChevronRight size={13} /></button><button className="add-button" onClick={() => addToCart(product)} aria-label={`Add ${product.name} to cart`}><Plus size={16} /> Add</button></div></div></div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-search"><Search size={25} /><h3>Nothing on the shelf yet</h3><p>Try a different search or clear the category filter.</p><Button variant="outline" onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}>Show everything</Button></div>
          )}
        </section>

        <section id="how-it-works" className="how-section section-wrap">
          <div className="how-intro"><div className="eyebrow"><span className="eyebrow-line" /> LESS RUNNING AROUND</div><h2>Three steps.<br /><em>More time back.</em></h2><p>CampusCart connects students with nearby vendors, so small daily needs do not have to become a full afternoon mission.</p><a href="#store" className="text-cta">Start with the shelf <ArrowRight size={15} /></a></div>
          <div className="steps-list">
            <div className="step-row"><span className="step-number">01</span><span className="step-icon"><Search size={19} /></span><div><h3>Find what you need</h3><p>Browse a focused selection of campus food, groceries, stationery and essentials.</p></div></div>
            <div className="step-row"><span className="step-number">02</span><span className="step-icon"><ShoppingBag size={19} /></span><div><h3>Build your basket</h3><p>Choose your items, check the total and add a short delivery note if you need one.</p></div></div>
            <div className="step-row"><span className="step-number">03</span><span className="step-icon"><PackageCheck size={19} /></span><div><h3>Get on with your day</h3><p>Submit the order request and collect it at your chosen campus location.</p></div></div>
          </div>
        </section>

        <section id="business-model" className="business-section">
          <div className="section-wrap">
            <div className="business-heading"><div><div className="eyebrow light"><span className="eyebrow-line" /> THE CAMPUSCART MODEL</div><h2>A better little system<br />for <em>campus life.</em></h2></div><p>CampusCart creates value by making everyday campus purchases easier for students while giving small vendors a simple route to more consistent orders.</p></div>
            <div className="business-grid">
              <article id="student-value" className="business-card"><span className="business-card-icon"><Store size={19} /></span><span className="card-kicker">FOR STUDENTS</span><h3>Convenience<br />that feels practical</h3><p>Students save time, avoid unnecessary trips and see the full cost before they order. The value is simple: one less queue on a busy day.</p><a href="#student-value" className="business-card-tag">Customer value <ArrowRight size={14} /></a></article>
              <article id="vendor-value" className="business-card featured"><span className="business-card-icon"><HandCoins size={19} /></span><span className="card-kicker">FOR VENDORS</span><h3>More orders,<br />less guesswork</h3><p>Participating vendors reach a concentrated student market, receive clearer order information and can plan stock around real demand.</p><a href="#vendor-value" className="business-card-tag">Vendor value <ArrowRight size={14} /></a></article>
              <article id="owner-value" className="business-card"><span className="business-card-icon"><CreditCard size={19} /></span><span className="card-kicker">FOR OWNERS</span><h3>A small fee<br />on useful volume</h3><p>CampusCart earns from delivery charges and a commission on vendor sales. As order volume grows, the platform grows with it.</p><a href="#owner-value" className="business-card-tag">Owner value <ArrowRight size={14} /></a></article>
            </div>
            <div className="revenue-band"><div className="revenue-label"><span>HOW CAMPUSCART EARNS</span><strong>Two clear revenue streams</strong></div><div className="revenue-item"><span className="revenue-number">01</span><div><strong>Delivery fee</strong><small>A small, transparent fee is added to each order to cover the campus hand-off.</small></div></div><div className="revenue-item"><span className="revenue-number">02</span><div><strong>Vendor commission</strong><small>CampusCart keeps an agreed percentage from each order it brings to a partner vendor.</small></div></div><div className="revenue-note">More useful orders<br /><ArrowRight size={15} /> more shared value</div></div>
          </div>
        </section>

        <section className="assignment-section section-wrap">
          <div className="assignment-card"><div><div className="eyebrow"><span className="eyebrow-line" /> GROUP ASSIGNMENT</div><h2>Built as a working<br /><em>e-commerce idea.</em></h2><p>CampusCart is designed to demonstrate the complete platform journey — from a student's need, to an order, to a business model that can support the people behind it.</p></div><div className="group-details"><span className="card-kicker">GROUP MEMBERS</span><div className="member-placeholder"><span className="placeholder-avatar">01</span><span>Name and admission number</span><span className="placeholder-line" /></div><div className="member-placeholder"><span className="placeholder-avatar">02</span><span>Name and admission number</span><span className="placeholder-line" /></div><div className="member-placeholder"><span className="placeholder-avatar">03</span><span>Name and admission number</span><span className="placeholder-line" /></div><small>Member details can be added before submission.</small></div></div>
        </section>
      </main>

      <footer className="site-footer"><div className="footer-main section-wrap"><a className="wordmark footer-wordmark" href="#top"><span className="wordmark-mark"><ShoppingCart size={17} strokeWidth={2.5} /></span><span>campus<span>cart</span></span></a><p>Small things, made easier<br />for student days.</p><div className="footer-links"><a href="#store">Shop</a><a href="#how-it-works">How it works</a><a href="#business-model">Our model</a></div></div><div className="footer-bottom section-wrap"><span>CampusCart · Student e-commerce concept</span><span>Designed for the everyday campus run.</span></div></footer>

      {cartOpen && (
        <div className="cart-layer" role="dialog" aria-modal="true" aria-label="Shopping cart">
          <button className="cart-backdrop" onClick={() => setCartOpen(false)} aria-label="Close cart" />
          <aside className="cart-panel">
            <div className="cart-panel-header"><div><span className="eyebrow"><span className="eyebrow-line" /> YOUR BASKET</span><h2>Ready when<br /><em>you are.</em></h2></div><button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close cart"><X size={20} /></button></div>
            {cart.length === 0 ? <div className="empty-cart"><div className="empty-cart-icon"><ShoppingBag size={27} /></div><h3>Your basket is empty</h3><p>Add a few useful things and they will show up here.</p><Button onClick={() => { setCartOpen(false); scrollToStore(); }}>Browse the shelf <ArrowRight size={15} /></Button></div> : <>
              <div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.id}><ProductArt product={item} small /><div className="cart-item-info"><strong>{item.name}</strong><small>{formatPrice(item.price)}</small><QuantityControl quantity={item.quantity} onDecrease={() => updateQuantity(item.id, -1)} onIncrease={() => updateQuantity(item.id, 1)} /></div><button className="remove-item" onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.name}`}><Trash2 size={15} /></button></div>)}</div>
              <div className="cart-summary"><div><span>Subtotal</span><b>{formatPrice(subtotal)}</b></div><div><span>Campus delivery</span><b>{formatPrice(deliveryFee)}</b></div><div className="cart-total"><span>Total</span><b>{formatPrice(total)}</b></div></div>
              <div className="cart-panel-footer"><div className="delivery-note"><Truck size={17} /><span><strong>Delivery around campus</strong><small>Usually ready in 25–35 minutes</small></span></div><Button className="checkout-button" onClick={() => setCheckoutOpen(true)}>Continue to checkout <ArrowRight size={16} /></Button></div>
            </>}
          </aside>
        </div>
      )}

      <Dialog open={selectedProduct !== null} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="product-dialog"><DialogHeader><ProductArt product={selectedProduct ?? products[0]} /><span className="card-kicker">{selectedProduct?.category}</span><DialogTitle>{selectedProduct?.name}</DialogTitle><DialogDescription>{selectedProduct?.description}</DialogDescription></DialogHeader><div className="dialog-price-row"><strong>{selectedProduct && formatPrice(selectedProduct.price)}</strong><span><Clock3 size={15} /> Ready around campus</span></div><Button className="dialog-add" onClick={() => { if (selectedProduct) addToCart(selectedProduct); setSelectedProduct(null); }}>Add to basket <Plus size={16} /></Button></DialogContent>
      </Dialog>

      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="checkout-dialog"><DialogHeader><span className="eyebrow"><span className="eyebrow-line" /> LAST STEP</span><DialogTitle>Where should we bring it?</DialogTitle><DialogDescription>Leave your details and CampusCart will prepare the order request for your chosen campus spot.</DialogDescription></DialogHeader><form className="checkout-form" onSubmit={submitOrder}><label>Full name<Input value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} placeholder="e.g. Amina Njeri" /></label><div className="form-two-col"><label>Phone number<Input value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} placeholder="07XX XXX XXX" /></label><label>Campus location<Input value={customer.location} onChange={(event) => setCustomer({ ...customer, location: event.target.value })} placeholder="Library entrance" /></label></div><label>Note for the vendor <Textarea value={customer.note} onChange={(event) => setCustomer({ ...customer, note: event.target.value })} placeholder="Anything they should know? (optional)" /></label><div className="checkout-total"><span>Order total</span><strong>{formatPrice(total)}</strong></div><Button type="submit" className="checkout-button">Submit order request <ArrowRight size={16} /></Button></form></DialogContent>
      </Dialog>

      <Dialog open={orderPlaced} onOpenChange={setOrderPlaced}>
        <DialogContent className="success-dialog"><div className="success-mark"><Check size={27} /></div><DialogHeader><span className="eyebrow"><span className="eyebrow-line" /> ORDER RECEIVED</span><DialogTitle>That’s one less thing<br /><em>to think about.</em></DialogTitle><DialogDescription>Your order request is in. A campus partner will confirm the details with you shortly.</DialogDescription></DialogHeader><div className="order-reference"><span>ORDER REFERENCE</span><strong>CC-{Math.floor(1000 + Math.random() * 9000)}</strong></div><Button onClick={() => setOrderPlaced(false)}>Back to the shelf <ArrowRight size={16} /></Button></DialogContent>
      </Dialog>
    </div>
  );
}
