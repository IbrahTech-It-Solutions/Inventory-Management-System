import { useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronRight,
  Package,
  Plus,
  ShoppingCart,
  Trash2,
  X,
} from "lucide-react";
import  Button  from "../../components/ui/button/Button";
import  Input  from "../../components/ui/input/Input";
import Select  from "../../components/ui/select/Select";
import styles from "../operationstyle/Operations.module.css";

type PurchaseItem = {
  id: string;
  productId: string;
  quantity: string;
  unitCost: string;
};

type Product = {
  id: string;
  name: string;
  sku: string;
};

const products: Product[] = [
  { id: "p1", name: "Samsung Galaxy S24", sku: "SAM-S24-001" },
  { id: "p2", name: "iPhone 15", sku: "IPH-15-001" },
  { id: "p3", name: "MacBook Air M3", sku: "MAC-M3-001" },
  { id: "p4", name: "Power Bank 20,000mAh", sku: "PWB-20K-001" },
];

const suppliers = [
  { value: "supplier-1", label: "ABC Suppliers" },
  { value: "supplier-2", label: "Tech Distribution Ltd." },
  { value: "supplier-3", label: "Global Electronics" },
];

const warehouses = [
  { value: "warehouse-1", label: "Main Warehouse" },
  { value: "warehouse-2", label: "Accra Store" },
  { value: "warehouse-3", label: "Kumasi Warehouse" },
];

const createItem = (): PurchaseItem => ({
  id: crypto.randomUUID(),
  productId: "",
  quantity: "1",
  unitCost: "0",
});

export default function Purchases() {
  const [reference, setReference] = useState("PO-10025");
  const [supplierId, setSupplierId] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [items, setItems] = useState<PurchaseItem[]>([createItem()]);

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum +
          (Number(item.quantity) || 0) * (Number(item.unitCost) || 0),
        0,
      ),
    [items],
  );

  const updateItem = (
    id: string,
    field: keyof PurchaseItem,
    value: string,
  ) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const addItem = () => {
    setItems((current) => [...current, createItem()]);
  };

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
        
          <h1>Purchases</h1>
          <p>
            Receive stock from suppliers and add multiple products to inventory
            in a single purchase operation.
          </p>
        </div>

        <div className={styles.headerActions}>
          <Button variant="border">
            <X size={16} />
            Cancel
          </Button>
          <Button variant="rounded">
            <Check size={16} />
            Receive Purchase
          </Button>
        </div>
      </header>

      <section className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <ShoppingCart size={19} />
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
            <ShoppingCart size={19} />
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
            <span>Total Cost</span>
            <strong>GH₵ {total.toLocaleString()}</strong>
          </div>
        </div>
      </section>

      <section className={styles.contentCard}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>Purchase Information</h2>
            <p>Enter the supplier, warehouse and purchase date.</p>
          </div>
        </div>

        <div className={styles.form}>
          <div className={styles.formGrid}>
            <Input
              label="Purchase Reference"
              value={reference}
              onChange={setReference}
              placeholder="PO-10025"
              required
            />

            <Select
              label="Supplier"
              value={supplierId}
              options={suppliers}
              onChange={setSupplierId}
              placeholder="Select supplier"
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
              label="Purchase Date"
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
            <h2>Purchase Items</h2>
            <p>Add as many products as this purchase contains.</p>
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
                <th>Unit Cost</th>
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
                  (Number(item.unitCost) || 0);

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
                        value={item.unitCost}
                        onChange={(value) =>
                          updateItem(item.id, "unitCost", value)
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
          <span>Purchase Total</span>
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
          Receive Purchase
        </Button>
      </div>
    </main>
  );
}