import { useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Package,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import  Button  from "../../components/ui/button/Button";
import  Input  from "../../components/ui/input/Input";
import Select  from "../../components/ui/select/Select";
import styles from "../operationstyle/Operations.module.css";

type TransferItem = {
  id: string;
  productId: string;
  quantity: string;
};

const products = [
  { id: "p1", name: "Samsung Galaxy S24", sku: "SAM-S24-001" },
  { id: "p2", name: "iPhone 15", sku: "IPH-15-001" },
  { id: "p3", name: "MacBook Air M3", sku: "MAC-M3-001" },
  { id: "p4", name: "Power Bank 20,000mAh", sku: "PWB-20K-001" },
];

const warehouses = [
  { value: "warehouse-1", label: "Main Warehouse" },
  { value: "warehouse-2", label: "Accra Store" },
  { value: "warehouse-3", label: "Kumasi Warehouse" },
];

const createItem = (): TransferItem => ({
  id: crypto.randomUUID(),
  productId: "",
  quantity: "1",
});

export default function StockTransfers() {
  const [reference, setReference] = useState("TRF-0049");
  const [fromWarehouse, setFromWarehouse] = useState("");
  const [toWarehouse, setToWarehouse] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [items, setItems] = useState<TransferItem[]>([createItem()]);

  const updateItem = (
    id: string,
    field: keyof TransferItem,
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
            <span>Stock Transfers</span>
          </div>
          <h1>Stock Transfers</h1>
          <p>
            Move multiple products between warehouses in one controlled stock
            transfer.
          </p>
        </div>

        <div className={styles.headerActions}>
          <Button variant="border">
            <X size={16} />
            Cancel
          </Button>
          <Button variant="rounded">
            <Check size={16} />
            Complete Transfer
          </Button>
        </div>
      </header>

      <section className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <ArrowRight size={19} />
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
            <ArrowRight size={19} />
          </div>
          <div>
            <span>Items Moving</span>
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
            <span>Status</span>
            <strong>Ready</strong>
          </div>
        </div>
      </section>

      <section className={styles.contentCard}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>Transfer Information</h2>
            <p>Choose the source and destination warehouses.</p>
          </div>
        </div>

        <div className={styles.form}>
          <div className={styles.formGrid}>
            <Input
              label="Transfer Reference"
              value={reference}
              onChange={setReference}
              placeholder="TRF-0049"
              required
            />

            <Input
              label="Transfer Date"
              value={date}
              onChange={setDate}
              type="date"
              required
            />

            <Select
              label="From Warehouse"
              value={fromWarehouse}
              options={warehouses}
              onChange={setFromWarehouse}
              placeholder="Select source warehouse"
              required
            />

            <Select
              label="To Warehouse"
              value={toWarehouse}
              options={warehouses}
              onChange={setToWarehouse}
              placeholder="Select destination warehouse"
              required
            />
          </div>

          {fromWarehouse && toWarehouse && fromWarehouse === toWarehouse && (
            <div className={styles.warning}>
              Source and destination warehouses must be different.
            </div>
          )}
        </div>
      </section>

      <section className={styles.contentCard}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>Transfer Items</h2>
            <p>Add every product that should move between the warehouses.</p>
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
                <th>Movement</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {items.map((item) => {
                const product = products.find(
                  (current) => current.id === item.productId,
                );

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

                    <td>
                      <div className={styles.movementFlow}>
                        <span>Source</span>
                        <ArrowRight size={15} />
                        <span>Destination</span>
                      </div>
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

        <div className={styles.transferFooter}>
          <div>
            <span>From</span>
            <strong>
              {warehouses.find((item) => item.value === fromWarehouse)
                ?.label || "Not selected"}
            </strong>
          </div>

          <ArrowRight size={18} />

          <div>
            <span>To</span>
            <strong>
              {warehouses.find((item) => item.value === toWarehouse)?.label ||
                "Not selected"}
            </strong>
          </div>
        </div>
      </section>

      <div className={styles.mobileActions}>
        <Button variant="border">
          <X size={16} />
          Cancel
        </Button>
        <Button variant="rounded">
          <Check size={16} />
          Complete Transfer
        </Button>
      </div>
    </main>
  );
}