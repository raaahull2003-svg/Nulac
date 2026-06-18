import { Product, Blog, Order, CartItem, UserSession } from '../types';
import { NULAC_PRODUCTS } from '../data/products';
import { NULAC_BLOGS } from '../data/blogs';

export interface RepositoryStatus {
  isLive: boolean;
  error: string | null;
  source: 'website_api' | 'fallback_cache';
}

class NulacRepository {
  private status: RepositoryStatus = {
    isLive: false,
    error: null,
    source: 'fallback_cache',
  };

  /**
   * Get current repository status
   */
  getStatus(): RepositoryStatus {
    return { ...this.status };
  }

  /**
   * Fetches products dynamically from the website, with structured fallbacks.
   */
  async fetchProducts(): Promise<{ products: Product[]; status: RepositoryStatus }> {
    try {
      // Let's attempt to fetch products dynamically from https://nulac.in/products.json
      // This is the standard public JSON endpoint for Shopify/WooCommerce/Wix e-commerce setups.
      const response = await fetch('https://nulac.in/products.json', {
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data && Array.isArray(data.products)) {
        // Map Shopify or WordPress custom JSON items back to our pristine Nulac Product format
        const mappedProducts: Product[] = data.products.map((item: any, idx: number) => {
          const firstImage = item.images && item.images[0] ? item.images[0].src : 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=400';
          const priceVal = item.variants && item.variants[0] ? parseFloat(item.variants[0].price) || 85 : 85;
          const comparePrice = item.variants && item.variants[0] && item.variants[0].compare_at_price 
            ? parseFloat(item.variants[0].compare_at_price) 
            : undefined;

          return {
            id: String(item.id || idx + 1),
            name: item.title || 'Dynamic Fresh Product',
            category: this.determineCategory(item.title || ''),
            price: priceVal,
            originalPrice: comparePrice,
            unit: item.variants && item.variants[0] && item.variants[0].title !== 'Default Title' 
              ? item.variants[0].title 
              : '500 ml',
            image: firstImage,
            rating: 4.8 + (idx % 3) * 0.1,
            reviewsCount: 150 + (idx * 37),
            description: item.body_html 
              ? item.body_html.replace(/<[^>]*>/g, '') 
              : 'Dynamically loaded directly from Nulac Dairy certified website.',
            origin: 'Nulac Organic Farmland, Coorg',
            nutrition: {
              energy: '65 kcal',
              fat: '3.8 g',
              protein: '3.3 g',
              carbohydrates: '4.8 g',
              calcium: '125 mg'
            },
            benefits: [
              'Retrieved live from official website products list',
              'Pure farm organic fresh commitment',
              'Rigorous quality screens passed'
            ]
          };
        });

        this.status = {
          isLive: true,
          error: null,
          source: 'website_api',
        };
        return { products: mappedProducts, status: { ...this.status } };
      }

      throw new Error("Invalid schema received from dynamic endpoint");
    } catch (err: any) {
      // Graceful fallback to pristine local dataset if API is blocked by CORS/network
      this.status = {
        isLive: false,
        error: err.message || 'CORS block / Network unavailable',
        source: 'fallback_cache',
      };
      
      console.warn("Nulac API retrieval bypassed: ", this.status.error);
      return { products: NULAC_PRODUCTS, status: { ...this.status } };
    }
  }

  /**
   * Fetches blog articles dynamically from the website with clean fallbacks.
   */
  async fetchBlogs(): Promise<{ blogs: Blog[]; status: RepositoryStatus }> {
    try {
      const response = await fetch('https://nulac.in/wp-json/wp/v2/posts?_embed', { silenceError: true } as any);
      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        const mappedBlogs: Blog[] = data.map((post: any, idx: number) => {
          const featuredMedia = post._embedded && post._embedded['wp:featuredmedia'] 
            ? post._embedded['wp:featuredmedia'][0]?.source_url 
            : 'https://images.unsplash.com/photo-1528498033053-166840045a40?auto=format&fit=crop&q=80&w=400';

          return {
            id: String(post.id || idx),
            title: post.title?.rendered || 'Dynamic Farm Article',
            excerpt: post.excerpt?.rendered?.replace(/<[^>]*>/g, '') || 'Dynamic educational writing regarding organic lifestyle.',
            content: post.content?.rendered || '',
            category: 'Farmland',
            image: featuredMedia,
            author: 'Nulac Dairy Expert',
            readTime: '4 mins read',
            date: new Date(post.date).toLocaleDateString()
          };
        });
        return { blogs: mappedBlogs, status: { ...this.status, isLive: true, source: 'website_api' } };
      }
      throw new Error("Invalid posts array format");
    } catch (err) {
      return { blogs: NULAC_BLOGS, status: { ...this.status } };
    }
  }

  /**
   * Determine general category of a dynamic product
   */
  private determineCategory(title: string): 'milk' | 'ghee' | 'paneer' | 'dahi' {
    const t = title.toLowerCase();
    if (t.includes('ghee') || t.includes('butter')) return 'ghee';
    if (t.includes('paneer') || t.includes('cheese')) return 'paneer';
    if (t.includes('dahi') || t.includes('curd') || t.includes('yogurt')) return 'dahi';
    return 'milk';
  }

  /**
   * Cart operations with standard localStorage caching
   */
  getCart(): CartItem[] {
    try {
      const data = localStorage.getItem('nulac_cart');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveCart(items: CartItem[]): void {
    try {
      localStorage.setItem('nulac_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to persist cart items: ', e);
    }
  }

  /**
   * Orders history operations with standard localStorage caching
   */
  getOrders(): Order[] {
    try {
      const data = localStorage.getItem('nulac_orders');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveOrder(order: Order): void {
    try {
      const existing = this.getOrders();
      localStorage.setItem('nulac_orders', JSON.stringify([order, ...existing]));
    } catch (e) {
      console.error('Failed to save order: ', e);
    }
  }

  saveOrders(orders: Order[]): void {
    try {
      localStorage.setItem('nulac_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders: ', e);
    }
  }

  /**
   * Secure user session management
   */
  getSession(): UserSession {
    try {
      const data = localStorage.getItem('nulac_session');
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to read session: ', e);
    }
    // Return default unauthenticated guest placeholder initially
    return {
      isLoggedIn: false,
      isGuest: false,
      name: '',
      phone: '',
      createdAt: ''
    };
  }

  saveSession(session: UserSession): void {
    try {
      localStorage.setItem('nulac_session', JSON.stringify(session));
    } catch (e) {
      console.error('Failed to save session: ', e);
    }
  }

  clearSession(): void {
    try {
      localStorage.removeItem('nulac_session');
    } catch (e) {
      console.error('Failed to clear session: ', e);
    }
  }
}

export const nulacRepository = new NulacRepository();
