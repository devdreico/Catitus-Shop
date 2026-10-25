import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Cat,
  Check,
  ChevronDown,
  Heart,
  Minus,
  Newspaper,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck,
  X,
} from 'lucide-react'
import { categories, newsItems, products, wikiItems, type EditorialItem, type Product } from './data'
import './App.css'

type Cart = Record<string, number>

const priceLabel = (amount: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(amount)

const readCart = (): Cart => {
  try {
    const storedCart = localStorage.getItem('gatitools-cart')
    return storedCart ? (JSON.parse(storedCart) as Cart) : {}
  } catch {
    return {}
  }
}

function App() {
  const appRef = useRef<HTMLDivElement>(null)
  const [cart, setCart] = useState<Cart>(readCart)
  const [activeCategory, setActiveCategory] = useState('Todo')
  const [search, setSearch] = useState('')
  const [savedProducts, setSavedProducts] = useState<Set<string>>(new Set())
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [activeArticle, setActiveArticle] = useState<EditorialItem | null>(null)
  const [orderReference, setOrderReference] = useState('')
  const [newsletterJoined, setNewsletterJoined] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem('gatitools-cart', JSON.stringify(cart))
    } catch {
      return
    }
  }, [cart])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const context = gsap.context(() => {
      const motion = gsap.matchMedia()
      motion.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.hero-copy > *', {
          y: 24,
          autoAlpha: 0,
          duration: 0.75,
          stagger: 0.09,
          ease: 'power3.out',
        })
        gsap.from('.hero-visual', {
          x: 28,
          autoAlpha: 0,
          duration: 0.9,
          delay: 0.14,
          ease: 'power3.out',
        })
        gsap.utils.toArray<HTMLElement>('.reveal').forEach((element) => {
          gsap.fromTo(
            element,
            { y: 24, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.65,
              ease: 'power2.out',
              scrollTrigger: { trigger: element, start: 'top 88%', once: true },
            },
          )
        })
        gsap.to('.hero-sticker', {
          y: -8,
          duration: 2.4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      })
      return () => motion.revert()
    }, appRef)

    return () => context.revert()
  }, [])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setCartOpen(false)
        setCheckoutOpen(false)
        setActiveArticle(null)
      }
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('es')
    return products.filter((product) => {
      const matchesCategory = activeCategory === 'Todo' || product.category === activeCategory
      const matchesSearch =
        !query || `${product.name} ${product.category} ${product.description}`.toLocaleLowerCase('es').includes(query)
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, search])

  const cartItems = products.filter((product) => cart[product.id])
  const cartCount = Object.values(cart).reduce((total, quantity) => total + quantity, 0)
  const cartTotal = cartItems.reduce((total, product) => total + product.price * cart[product.id], 0)

  const addToCart = (product: Product) => {
    setCart((current) => ({ ...current, [product.id]: (current[product.id] ?? 0) + 1 }))
  }

  const setQuantity = (productId: string, quantity: number) => {
    setCart((current) => {
      const updated = { ...current }
      if (quantity <= 0) delete updated[productId]
      else updated[productId] = quantity
      return updated
    })
  }

  const toggleSaved = (productId: string) => {
    setSavedProducts((current) => {
      const updated = new Set(current)
      if (updated.has(productId)) updated.delete(productId)
      else updated.add(productId)
      return updated
    })
  }

  const submitOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setOrderReference(`GT-${Date.now().toString().slice(-6)}`)
    setCart({})
  }

  const openArticle = (article: EditorialItem) => setActiveArticle(article)

  return (
    <div className="site-shell" ref={appRef}>
      <div className="announcement-bar">
        <span>El amor no se pesa. Los paquetes, tampoco.</span>
        <span className="announcement-note"><Truck size={14} /> Paga cuando llegue a casa</span>
      </div>

      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Gatitools, ir al inicio">
          <span className="brand-mark"><Cat size={23} strokeWidth={2.1} /></span>
          <span>gati<span>tools</span><small>club de gatos curiosos</small></span>
        </a>
        <nav className="primary-nav" aria-label="Navegacion principal">
          <a className="active" href="#tienda">Tienda</a>
          <a href="#wiki">Wiki felina</a>
          <a href="#noticias">Lo que pasa</a>
        </nav>
        <div className="header-actions">
          <label className="header-search">
            <Search size={17} aria-hidden="true" />
            <input
              aria-label="Buscar productos"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
              }}
              onKeyDown={(event) => { if (event.key === 'Enter') document.getElementById('tienda')?.scrollIntoView({ behavior: 'smooth' }) }}
              placeholder="Buscar algo..."
            />
          </label>
          <button className="bag-button" type="button" onClick={() => setCartOpen(true)} aria-label={`Abrir carrito, ${cartCount} productos`}>
            <ShoppingBag size={19} />
            <span>Bolsa</span>
            <b>{cartCount}</b>
          </button>
        </div>
      </header>

      <main id="inicio">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> OBJETOS PARA VIDAS CON BIGOTES</p>
            <h1>El mundo es suyo.<br /><em>La casa tambien.</em></h1>
            <h1>El mundo es suyo.<br /><em>La casa también.</em></h1>
            <p className="hero-description">Pequeños grandes hallazgos para que tu gato viva a su manera: cómodo, curioso y un poquito consentido.</p>
            <div className="hero-actions">
              <a className="button button-dark" href="#tienda">Descubrir la tienda <ArrowRight size={17} /></a>
              <a className="text-link" href="#wiki">Una guia para quererlos <ArrowDownRight size={16} /></a>
                          <a className="text-link" href="#wiki">Una guía para quererlos <ArrowDownRight size={16} /></a>
            </div>
            <div className="hero-proof">
              <div className="avatar-stack" aria-hidden="true">
                <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=80&q=80" alt="" />
                <img src="https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=80&q=80" alt="" />
                <img src="https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=80&q=80" alt="" />
              </div>
              <span><strong>Un club con bigotes</strong><br />para gatos de verdad</span>
            </div>
          </div>
          <div className="hero-visual">
            <img
              className="hero-photo"
              src="https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=1500&q=90"
              alt="Gato descansando en un espacio lleno de luz natural"
            />
            <div className="hero-sticker glass-panel">
              <span className="sticker-icon"><Sparkles size={17} /></span>
              <span><strong>Elegido por ellos</strong><small>Curado con mucho mimo</small></span>
            </div>
            <span className="hero-caption">Una vida suave sienta bien.</span>
          </div>
          <a className="scroll-cue" href="#favoritos" aria-label="Bajar a los productos"><ChevronDown size={18} /></a>
        </section>

        <section className="benefit-ribbon" aria-label="Ventajas de Gatitools">
          <div><span className="benefit-icon"><ShoppingBag size={19} /></span><span><strong>Compra sin prisa</strong><small>Pagas al recibir tu pedido</small></span></div>
          <div><span className="benefit-icon"><Heart size={19} /></span><span><strong>Hecho para convivir</strong><small>Objetos elegidos con criterio</small></span></div>
          <div><span className="benefit-icon"><BookOpen size={19} /></span><span><strong>Aprendemos juntos</strong><small>Ideas para una vida mas feliz</small></span></div>
        </section>

        <section className="shop-section section-wrap" id="tienda">
          <div className="section-heading reveal" id="favoritos">
            <div>
              <p className="eyebrow">LA SELECCIÓN GATITOOLS</p>
              <h2>Sus favoritos.<br /><em>Tú también los vas a querer.</em></h2>
            </div>
            <p className="section-aside">Piezas bien pensadas para los que siempre caen de pie.</p>
          </div>
          <div className="shop-toolbar reveal">
            <div className="category-tabs" role="group" aria-label="Filtrar por categoría">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={activeCategory === category ? 'category-tab selected' : 'category-tab'}
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={activeCategory === category}
                >
                  {category}
                </button>
              ))}
            </div>
            <label className="mobile-search">
              <Search size={17} aria-hidden="true" />
              <input aria-label="Buscar en productos" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar" />
            </label>
            <span className="result-count">{visibleProducts.length} hallazgos</span>
          </div>
          {visibleProducts.length ? (
            <div className="product-grid">
              {visibleProducts.map((product, index) => (
                <article className="product-card reveal" key={product.id} style={{ '--card-index': index } as React.CSSProperties}>
                  <div className="product-image-wrap">
                    <img src={product.image} alt={`Gato disfrutando una escena relacionada con ${product.name}`} loading="lazy" />
                    {product.badge && <span className="product-badge">{product.badge}</span>}
                    <button
                      type="button"
                      className={savedProducts.has(product.id) ? 'favorite-button saved' : 'favorite-button'}
                      onClick={() => toggleSaved(product.id)}
                      aria-label={savedProducts.has(product.id) ? `Quitar ${product.name} de favoritos` : `Guardar ${product.name} en favoritos`}
                      aria-pressed={savedProducts.has(product.id)}
                    >
                      <Heart size={17} fill={savedProducts.has(product.id) ? 'currentColor' : 'none'} />
                    </button>
                    <button className="quick-add" type="button" onClick={() => addToCart(product)} aria-label={`Añadir ${product.name} a la bolsa`}>
                      <Plus size={20} />
                    </button>
                  </div>
                  <div className="product-meta"><span>{product.category}</span></div>
                  <h3>{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-bottom"><strong>{priceLabel(product.price)}</strong><button type="button" onClick={() => addToCart(product)}>Añadir <ArrowUpRight size={15} /></button></div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-search"><Search size={23} /><p>No encontramos nada con esa busqueda.</p><button type="button" onClick={() => { setSearch(''); setActiveCategory('Todo') }}>Ver todo</button></div>
          )}
            <div className="shop-foot reveal"><span>Una buena compra empieza por una buena siesta.</span><a href="#wiki">Leer la wiki <ArrowRight size={15} /></a></div>
        </section>

        <section className="story-section section-wrap" id="club">
          <div className="story-copy reveal">
            <p className="eyebrow"><span className="eyebrow-dot green" /> UN MOMENTO DE GATO</p>
            <h2>Pequeñas pausas.<br /><em>Grandes ronroneos.</em></h2>
            <p>La vida con gatos tiene su propio ritmo. Mira, respira y recuerda que no todo necesita hacerse ahora mismo.</p>
            <a className="text-link" href="#wiki">Ideas para cuidar mejor <ArrowRight size={16} /></a>
          </div>
          <div className="story-video-wrap reveal">
            <video
              controls
              playsInline
              preload="none"
              poster="https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=1200&q=85"
              aria-label="Video de un gato disfrutando un momento tranquilo"
            >
              <source src="https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4" type="video/mp4" />
              Tu navegador no puede reproducir este video.
            </video>
            <span className="video-label">PAUSA FELINA No. 01</span>
          </div>
        </section>

        <section className="wiki-section section-wrap" id="wiki">
          <div className="section-heading reveal">
            <div><p className="eyebrow">WIKI PARA GATOS Y SU GENTE</p><h2>Para entenderlos<br /><em>un poquito más.</em></h2></div>
            <a className="round-link" href="#noticias" aria-label="Ir a noticias"><ArrowDownRight size={20} /></a>
          </div>
          <div className="editorial-grid">
            {wikiItems.map((item, index) => (
              <button className={`editorial-card reveal editorial-${index + 1}`} key={item.title} type="button" onClick={() => openArticle(item)}>
                <span className="editorial-image"><img src={item.image} alt="" loading="lazy" /><span className="editorial-icon"><BookOpen size={17} /></span></span>
                <span className="editorial-copy"><span className="eyebrow">{item.eyebrow}</span><strong>{item.title}</strong><span>{item.description}</span><span className="read-more">Leer guia <ArrowUpRight size={15} /></span></span>
              </button>
            ))}
            <div className="wiki-note reveal"><span className="note-sparkle"><Sparkles size={19} /></span><p>Curiosidad gatuna para llevar.</p><span>Consejos con cariño, nunca sustitutos de una visita veterinaria.</span><a href="#noticias">Ver mas historias <ArrowRight size={15} /></a></div>
          </div>
        </section>

        <section className="news-section" id="noticias">
          <div className="section-wrap news-inner">
            <div className="news-heading reveal"><div><p className="eyebrow">EL MUNDO, DESDE EL SOFÁ</p><h2>Lo que pasa<br /><em>por aquí.</em></h2></div><span className="news-mark"><Newspaper size={24} /></span></div>
            <div className="news-grid">
              {newsItems.map((item) => (
                <button className="news-item reveal" type="button" key={item.title} onClick={() => openArticle(item)}>
                  <span className="news-thumb"><img src={item.image} alt="" loading="lazy" /></span>
                  <span className="news-copy"><span className="eyebrow">{item.eyebrow}</span><strong>{item.title}</strong><span>{item.description}</span><span className="read-more">{item.readTime} <ArrowUpRight size={15} /></span></span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="newsletter-section section-wrap reveal">
          <div className="newsletter-cat"><img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=420&q=85" alt="Gato mirando con curiosidad" loading="lazy" /></div>
          <div className="newsletter-copy"><p className="eyebrow">CORREO CON BIGOTES</p><h2>Una nota bonita<br /><em>de vez en cuando.</em></h2></div>
          <form className="newsletter-form" onSubmit={(event) => { event.preventDefault(); setNewsletterJoined(true) }}>
            <label htmlFor="newsletter-email">{newsletterJoined ? '¡Ya estás en la lista!' : 'Tu correo electrónico'}</label>
            <div><input id="newsletter-email" type="email" placeholder="hola@tucasa.com" required disabled={newsletterJoined} /><button type="submit" aria-label="Suscribirme" disabled={newsletterJoined}><ArrowRight size={18} /></button></div>
            <small>{newsletterJoined ? 'Gracias. En esta demo no guardamos direcciones.' : 'Sin spam. Con mucho gato.'}</small>
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#inicio"><span className="brand-mark"><Cat size={22} /></span><span>gati<span>tools</span><small>club de gatos curiosos</small></span></a>
        <p>Hecho para quienes comparten el sofa.</p>
        <div className="footer-links"><a href="#tienda">Tienda</a><a href="#wiki">Wiki felina</a><a href="#noticias">Noticias</a></div>
        <span className="copyright">© 2026 GATITOOLS</span>
      </footer>

      {cartOpen && (
        <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false) }}>
          <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
            <div className="drawer-header"><div><p className="eyebrow">TODO LO BUENO, AQUI</p><h2 id="cart-title">Tu bolsa <span>({cartCount})</span></h2></div><button className="icon-button" type="button" onClick={() => setCartOpen(false)} aria-label="Cerrar bolsa"><X size={21} /></button></div>
            {cartItems.length ? <>
              <div className="cart-items">{cartItems.map((product) => (
                <article className="cart-item" key={product.id}>
                  <img src={product.image} alt="" />
                  <div className="cart-item-copy"><span>{product.category}</span><h3>{product.name}</h3><strong>{priceLabel(product.price)}</strong><div className="quantity-control"><button type="button" onClick={() => setQuantity(product.id, cart[product.id] - 1)} aria-label={`Quitar una unidad de ${product.name}`}><Minus size={13} /></button><span>{cart[product.id]}</span><button type="button" onClick={() => setQuantity(product.id, cart[product.id] + 1)} aria-label={`Anadir una unidad de ${product.name}`}><Plus size={13} /></button></div></div>
                  <button className="remove-item" type="button" onClick={() => setQuantity(product.id, 0)} aria-label={`Eliminar ${product.name}`}><Trash2 size={16} /></button>
                </article>
              ))}</div>
              <div className="drawer-bottom"><div className="subtotal-row"><span>Subtotal</span><strong>{priceLabel(cartTotal)}</strong></div><p><Truck size={15} /> El costo de envio se confirma al coordinar la entrega.</p><button className="button button-dark checkout-button" type="button" onClick={() => { setCartOpen(false); setCheckoutOpen(true); setOrderReference('') }}>Seguir con mi pedido <ArrowRight size={17} /></button><span className="payment-note"><Check size={14} /> Pagas en efectivo cuando recibes</span></div>
            </> : <div className="empty-cart"><span><ShoppingBag size={27} /></span><h3>Tu bolsa esta descansando.</h3><p>Cuando encuentres algo para su majestad, aqui lo guardamos.</p><button className="button button-dark" type="button" onClick={() => { setCartOpen(false); document.getElementById('tienda')?.scrollIntoView({ behavior: 'smooth' }) }}>Explorar la tienda <ArrowRight size={16} /></button></div>}
          </aside>
        </div>
      )}

      {checkoutOpen && (
        <div className="overlay checkout-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setCheckoutOpen(false) }}>
          <section className="checkout-dialog" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
            <button className="icon-button checkout-close" type="button" onClick={() => setCheckoutOpen(false)} aria-label="Cerrar checkout"><X size={21} /></button>
            {orderReference ? <div className="order-success"><span className="success-icon"><Check size={26} /></span><p className="eyebrow">LISTO, HUMANO</p><h2>Pedido apuntado.<br /><em>Ahora toca esperar.</em></h2><p>Referencia <strong>{orderReference}</strong>. Este prototipo no envía pedidos a una tienda real; conecta el checkout con tu sistema de ventas antes de publicar.</p><button className="button button-dark" type="button" onClick={() => setCheckoutOpen(false)}>Volver a Gatitools <ArrowRight size={16} /></button></div> : <>
              <div className="checkout-heading"><p className="eyebrow">ÚLTIMO PASO, SIN PRISAS</p><h2 id="checkout-title">¿A dónde lo<br /><em>llevamos?</em></h2><p>Déjanos tus datos para coordinar la entrega. Pagas en efectivo cuando recibas.</p></div>
              <form className="checkout-form" onSubmit={submitOrder}>
                <label>Nombre completo<input name="name" autoComplete="name" required placeholder="Cómo te llamas" /></label>
                <div className="form-row"><label>Teléfono<input name="phone" type="tel" autoComplete="tel" required pattern="[0-9+() -]{7,}" placeholder="Tu número de contacto" /></label><label>Ciudad<input name="city" autoComplete="address-level2" required placeholder="Ciudad" /></label></div>
                <label>Dirección de entrega<input name="address" autoComplete="street-address" required placeholder="Calle, número y apartamento" /></label>
                <label>Indicaciones para el mensajero <span className="optional">Opcional</span><textarea name="notes" rows={2} placeholder="Conjunto, portería, referencia..." /></label>
                <div className="checkout-summary"><span>{cartCount} {cartCount === 1 ? 'producto' : 'productos'}</span><strong>{priceLabel(cartTotal)}</strong></div>
                <div className="cash-notice"><span><ShoppingBag size={17} /></span><p><strong>Contra entrega</strong><br />El pago es en efectivo al recibir. No pedimos datos bancarios.</p></div>
                <button className="button button-dark checkout-button" type="submit">Confirmar pedido <ArrowRight size={17} /></button>
              </form>
            </>}
          </section>
        </div>
      )}

      {activeArticle && (
        <div className="overlay article-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveArticle(null) }}>
          <article className="article-dialog" role="dialog" aria-modal="true" aria-labelledby="article-title">
            <button className="icon-button article-close" type="button" onClick={() => setActiveArticle(null)} aria-label="Cerrar artículo"><X size={21} /></button>
            <img className="article-cover" src={activeArticle.image} alt="" />
            <div className="article-body"><p className="eyebrow">{activeArticle.eyebrow}</p><h2 id="article-title">{activeArticle.title}</h2><p className="article-lead">{activeArticle.description}</p><p>Los gatos entienden el mundo con todos sus sentidos. Un espacio tranquilo, rutinas previsibles y la libertad de acercarse cuando quieran hacen mucho más que cualquier gran gesto.</p><p>Observa sus señales, ofrece opciones y deja que marque el ritmo. Cada gato es distinto: la curiosidad se acompaña mejor con paciencia, juego y un lugar seguro al que volver.</p><div className="article-disclaimer"><Sparkles size={17} /><span>Una guía general para convivir mejor. Ante dudas de salud o comportamiento, consulta con un profesional veterinario.</span></div><button className="text-link" type="button" onClick={() => setActiveArticle(null)}>Seguir explorando <ArrowRight size={16} /></button></div>
          </article>
        </div>
      )}
    </div>
  )
}

export default App
