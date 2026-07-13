export type ProductBadge = "new" | "sale" | "featured";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "cod" | "bank_transfer" | "card";

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          parent_slug: string | null;
          image_url: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          parent_slug?: string | null;
          image_url?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          short_description: string | null;
          category_id: string | null;
          category_name: string;
          material: string | null;
          color: string | null;
          size: string | null;
          room_type: string | null;
          price: number | null;
          original_price: number | null;
          stock_quantity: number;
          in_stock: boolean;
          badge: ProductBadge | null;
          is_best_seller: boolean;
          is_new_arrival: boolean;
          is_featured: boolean;
          is_published: boolean;
          video_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          short_description?: string | null;
          category_id?: string | null;
          category_name: string;
          material?: string | null;
          color?: string | null;
          size?: string | null;
          room_type?: string | null;
          price: number | null;
          original_price?: number | null;
          stock_quantity?: number;
          badge?: ProductBadge | null;
          is_best_seller?: boolean;
          is_new_arrival?: boolean;
          is_featured?: boolean;
          is_published?: boolean;
          video_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["id"];
            isOneToOne: false;
            referencedRelation: "product_images";
            referencedColumns: ["product_id"];
          },
        ];
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          alt_text: string | null;
          sort_order: number;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          url: string;
          alt_text?: string | null;
          sort_order?: number;
          is_primary?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["product_images"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          status: OrderStatus;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          shipping_address: string;
          shipping_city: string;
          shipping_notes: string | null;
          payment_method: PaymentMethod;
          coupon_code: string | null;
          subtotal: number;
          shipping_cost: number;
          discount: number;
          total: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          status?: OrderStatus;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          shipping_address: string;
          shipping_city: string;
          shipping_notes?: string | null;
          payment_method: PaymentMethod;
          coupon_code?: string | null;
          subtotal: number;
          shipping_cost?: number;
          discount?: number;
          total: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["id"];
            isOneToOne: false;
            referencedRelation: "order_items";
            referencedColumns: ["order_id"];
          },
        ];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          product_name: string;
          product_slug: string;
          product_image: string | null;
          unit_price: number;
          quantity: number;
          line_total: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          product_name: string;
          product_slug: string;
          product_image?: string | null;
          unit_price: number;
          quantity: number;
          line_total: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      deals: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          short_description: string | null;
          image_url: string | null;
          deal_type: "flash_sale" | "bundle" | "seasonal";
          badge: string | null;
          bundle_price: number | null;
          starts_at: string | null;
          ends_at: string | null;
          is_active: boolean;
          is_published: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          short_description?: string | null;
          image_url?: string | null;
          deal_type?: "flash_sale" | "bundle" | "seasonal";
          badge?: string | null;
          bundle_price?: number | null;
          starts_at?: string | null;
          ends_at?: string | null;
          is_active?: boolean;
          is_published?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["deals"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "deal_products_deal_id_fkey";
            columns: ["id"];
            isOneToOne: false;
            referencedRelation: "deal_products";
            referencedColumns: ["deal_id"];
          },
        ];
      };
      deal_products: {
        Row: {
          id: string;
          deal_id: string;
          product_id: string;
          deal_price: number | null;
          quantity: number;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          deal_id: string;
          product_id: string;
          deal_price?: number | null;
          quantity?: number;
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["deal_products"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "deal_products_deal_id_fkey";
            columns: ["deal_id"];
            isOneToOne: false;
            referencedRelation: "deals";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "deal_products_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type DbProduct = Database["public"]["Tables"]["products"]["Row"];
export type DbProductImage = Database["public"]["Tables"]["product_images"]["Row"];

export type DbProductWithImages = DbProduct & {
  product_images: DbProductImage[];
};

export type DbDeal = Database["public"]["Tables"]["deals"]["Row"];
export type DbDealProduct = Database["public"]["Tables"]["deal_products"]["Row"];

export type DbDealProductWithProduct = DbDealProduct & {
  products: DbProductWithImages;
};

export type DbDealWithProducts = DbDeal & {
  deal_products: DbDealProductWithProduct[] | null;
};
