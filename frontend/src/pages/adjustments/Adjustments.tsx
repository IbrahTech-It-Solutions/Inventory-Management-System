import { useState } from "react";
import {
  Check,
  ChevronRight,
  Minus,
  Package,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import  Button  from "../../components/ui/button/Button";
import  Input  from "../../components/ui/input/Input";
import Select  from "../../components/ui/select/Select";
import styles from "../operationstyle/Operations.module.css";

type AdjustmentItem = {
  id: string;
  productId: string;
  direction: "increase" | "decrease";
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

const reasons = [
  { value: "physical-count", label: "Physical Stock Count" },
  { value: "damaged", label: "Damaged Stock" },
  { value: "lost", label: "Lost Stock" },
  { value: "found", label: "Found Stock" },
  { value: "correction", label: "Inventory Correction" },
];

const createItem = (): AdjustmentItem => ({
  id: crypto.randomUUID(),
  productId: "",
  direction: "increase",
  quantity: "1",
});

export default function StockAdjustments() {
  const [reference, setReference] = useState("ADJ-0013");
  const [warehouseId, setWarehouseId] = useState("");
  const [reason, setReason] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [items, setItems] = useState<AdjustmentItem[]>([createItem()]);

  const updateItem = (
    id: string,
    field: keyof AdjustmentItem,
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

  const increaseQuantity = items
    .filter((item) => item.direction === "increase")
    .reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

  const decreaseQuantity = items
    .filter((item) => item.direction === "decrease")
    .reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <div className={styles.breadcrumb}>
            <span>Operations</span>
            <ChevronRight size={14} />
            <span>Stock Adjustments</span>
          </div>
          <h1>Stock Adjustments</h1>
          <p>
            Correct inventory quantities by adding or removing stock for
            multiple products in one adjustment.
          </p>
        </div>

        <div className={styles.headerActions}>
          <Button variant="border">
            <X size={16} />
            Cancel
          </Button>
          <Button variant="rounded">
            <Check size={16} />
            Apply Adjustment
          </Button>
        </div>
      </header>

      <section className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <Package size={19} />
          </div>
          <div>
            <span>Reference</span>
            <strong>{reference}</strong>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <Plus size={19} />
          </div>
          <div>
            <span>Stock Increase</span>
            <strong>{increaseQuantity}</strong>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <Minus size={19} />
          </div>
          <div>
            <span>Stock Decrease</span>
            <strong>{decreaseQuantity}</strong>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <Check size={19} />
          </div>
          <div>
            <span>Products</span>
            <strong>{items.length}</strong>
          </div>
        </div>
      </section>

      <section className={styles.contentCard}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>Adjustment Information</h2>
            <p>Define where and why the stock adjustment is being made.</p>
          </div>
        </div>

        <div className={styles.form}>
          <div className={styles.formGrid}>
            <Input
              label="Adjustment Reference"
              value={reference}
              onChange={setReference}
              placeholder="ADJ-0013"
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

            <Select
              label="Reason"
              value={reason}
              options={reasons}
              onChange={setReason}
              placeholder="Select reason"
              required
            />

            <Input
              label="Adjustment Date"
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
            <h2>Adjustment Items</h2>
            <p>
              Choose whether each product should increase or decrease stock.
            </p>
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
                <th>Adjustment</th>
                <th>Quantity</th>
                <th>Effect</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {items.map((item) => {
                const product = products.find(
                  (current) => current.id === item.productId,
                );
                const quantity = Number(item.quantity) || 0;

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

                    <td className={styles.adjustmentSelect}>
                      <Select
                        value={item.direction}
                        options={[
                          { value: "increase", label: "Increase Stock" },
                          { value: "decrease", label: "Decrease Stock" },
                        ]}
                        onChange={(value) =>
                          updateItem(
                            item.id,
                            "direction",
                            value as AdjustmentItem["direction"],
                          )
                        }
                      />
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
                      <span
                        className={
                          item.direction === "increase"
                            ? styles.positive
                            : styles.negative
                        }
                      >
                        {item.direction === "increase" ? "+" : "-"}
                        {quantity}
                      </span>
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

        <div className={styles.adjustmentFooter}>
          <div>
            <span>Total Increase</span>
            <strong className={styles.positive}>+{increaseQuantity}</strong>
          </div>

          <div>
            <span>Total Decrease</span>
            <strong className={styles.negative}>-{decreaseQuantity}</strong>
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
          Apply Adjustment
        </Button>
      </div>
    </main>
  );
}