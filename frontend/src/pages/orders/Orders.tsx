import { useMemo, useState } from "react";
import {
  Check,
  ChevronRight,
  Package,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import  Button  from "../../components/ui/button/Button";
import  Input  from "../../components/ui/input/Input";
import Select  from "../../components/ui/select/Select";
import styles from "../operationstyle/Operations.module.css";

type SaleItem = {
  id: string;
  productId: string;
  quantity: string;
  unitPrice: string;
};

const products = [
  { id: "p1", name: "Samsung Galaxy S24", sku: "SAM-S24-001" },
  { id: "p2", name: "iPhone 15", sku: "IPH-15-001" },
  { id: "p3", name: "MacBook Air M3", sku: "MAC-M3-001" },
  { id: "p4", name: "Power Bank 20,000mAh", sku: "PWB-20K-001" },
];

const customers = [
  { value: "customer-1", label: "Walk-in Customer" },
  { value: "customer-2", label: "Tech Solutions Ltd." },
  { value: "customer-3", label: "Prime Retail" },
];

const warehouses = [
  { value: "warehouse-1", label: "Main Warehouse" },
  { value: "warehouse-2", label: "Accra Store" },
  { value: "warehouse-3", label: "Kumasi Warehouse" },
];

const createItem = (): SaleItem => ({
  id: crypto.randomUUID(),
  productId: "",
  quantity: "1",
  unitPrice: "0",
});

export default function Sales() {
  const [reference, setReference] = useState("ORD-20342");
  const [customerId, setCustomerId] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [items, setItems] = useState<SaleItem[]>([createItem()]);

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum +
          (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
        0,
      ),
    [items],
  );

  const updateItem = (
    id: string,
    field: keyof SaleItem,
    value: string,
  ) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const addItem = () => setItems((current) => [...current, createItem()]);

  const removeItem = (id: string) => {
    setItems((current) =>
      current.length === 1 ? current : current.filter((item) => item.id !== id),
    );
  };

  const productOptions = products.map((product) => ({
    value: product.id,
    label: `${product.name} — ${product.sku}`,
  }));

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <div className={styles.breadcrumb}>
            <span>Operations</span>
            <ChevronRight size={14} />
            <span>Sales</span>
          </div>
          <h1>Sales / Orders</h1>
          <p>
            Create sales orders containing multiple products and reduce stock
            from the selected warehouse.
          </p>
        </div>

        <div className={styles.headerActions}>
          <Button variant="border">
            <X size={16} />
            Cancel
          </Button>
          <Button variant="rounded">
            <Check size={16} />
            Complete Sale
          </Button>
        </div>
      </header>

      <section className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <ShoppingBag size={19} />
          </div>
          <div>
            <span>Reference</span>
            <strong>{reference}</strong>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <Package size={19} />
          </div>
          <div>
            <span>Products</span>
            <strong>{items.length}</strong>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <ShoppingBag size={19} />
          </div>
          <div>
            <span>Total Quantity</span>
            <strong>
              {items.reduce(
                (sum, item) => sum + (Number(item.quantity) || 0),
                0,
              )}
            </strong>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <Check size={19} />
          </div>
          <div>
            <span>Order Total</span>
            <strong>GH₵ {total.toLocaleString()}</strong>
          </div>
        </div>
      </section>

      <section className={styles.contentCard}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>Order Information</h2>
            <p>Enter the customer, warehouse and order date.</p>
          </div>
        </div>

        <div className={styles.form}>
          <div className={styles.formGrid}>
            <Input
              label="Order Reference"
              value={reference}
              onChange={setReference}
              placeholder="ORD-20342"
              required
            />

            <Select
              label="Customer"
              value={customerId}
              options={customers}
              onChange={setCustomerId}
              placeholder="Select customer"
              required
            />

            <Select
              label="Warehouse"
              value={warehouseId}
              options={warehouses}
              onChange={setWarehouseId}
              placeholder="Select warehouse"
              required
            />

            <Input
              label="Order Date"
              value={date}
              onChange={setDate}
              type="date"
              required
            />
          </div>
        </div>
      </section>

      <section className={styles.contentCard}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>Order Items</h2>
            <p>Add multiple products to this sale.</p>
          </div>

          <Button variant="border" onClick={addItem}>
            <Plus size={16} />
            Add Product
          </Button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {items.map((item) => {
                const product = products.find(
                  (current) => current.id === item.productId,
                );
                const lineTotal =
                  (Number(item.quantity) || 0) *
                  (Number(item.unitPrice) || 0);

                return (
                  <tr key={item.id}>
                    <td className={styles.productInput}>
                      <Select
                        value={item.productId}
                        options={productOptions}
                        onChange={(value) =>
                          updateItem(item.id, "productId", value)
                        }
                        placeholder="Select product"
                      />
                    </td>

                    <td>
                      <span className={styles.mutedText}>
                        {product?.sku || "—"}
                      </span>
                    </td>

                    <td className={styles.inputCell}>
                      <Input
                        value={item.quantity}
                        onChange={(value) =>
                          updateItem(item.id, "quantity", value)
                        }
                        type="number"
                        min="1"
                      />
                    </td>

                    <td className={styles.inputCell}>
                      <Input
                        value={item.unitPrice}
                        onChange={(value) =>
                          updateItem(item.id, "unitPrice", value)
                        }
                        type="number"
                        min="0"
                      />
                    </td>

                    <td>
                      <strong>GH₵ {lineTotal.toLocaleString()}</strong>
                    </td>

                    <td>
                      <button
                        className={styles.iconButton}
                        type="button"
                        onClick={() => removeItem(item.id)}
                        disabled={items.length === 1}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className={styles.totalBar}>
          <span>Order Total</span>
          <strong>GH₵ {total.toLocaleString()}</strong>
        </div>
      </section>

      <div className={styles.mobileActions}>
        <Button variant="border">
          <X size={16} />
          Cancel
        </Button>
        <Button variant="rounded">
          <Check size={16} />
          Complete Sale
        </Button>
      </div>
    </main>
  );
}