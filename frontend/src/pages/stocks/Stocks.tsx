import { useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ChevronDown,
  ClipboardList,
  Package,
  Search,
  SlidersHorizontal,
  TriangleAlert,
  X,
} from "lucide-react";
import styles from "./Stock.module.css";

type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";

type StockItem = {
  id: string;
  product: string;
  sku: string;
  warehouse: string;
  category: string;
  quantity: number;
  reserved: number;
  minimumStock: number;
  value: number;
  status: StockStatus;
};

type MovementType =
  | "Purchase"
  | "Sale"
  | "Adjustment"
  | "Transfer";

type StockMovement = {
  id: string;
  date: string;
  product: string;
  type: MovementType;
  quantity: number;
  warehouse: string;
  reference: string;
  user: string;
};

const initialStock: StockItem[] = [
  {
    id: "1",
    product: "Galaxy S24",
    sku: "MELE-SSMA-TSMT-BSAM-MGY4-V256",
    warehouse: "Main Warehouse",
    category: "Smartphones",
    quantity: 50,
    reserved: 5,
    minimumStock: 10,
    value: 42500,
    status: "In Stock",
  },
  {
    id: "2",
    product: "iPhone 15",
    sku: "MELE-SSMA-TSMT-BAPP-MIP5-V128",
    warehouse: "Main Warehouse",
    category: "Smartphones",
    quantity: 8,
    reserved: 2,
    minimumStock: 10,
    value: 9200,
    status: "Low Stock",
  },
  {
    id: "3",
    product: "MacBook Air M3",
    sku: "MELE-CLPT-TLAP-BAPP-MM3A-V256",
    warehouse: "Main Warehouse",
    category: "Laptops",
    quantity: 14,
    reserved: 3,
    minimumStock: 5,
    value: 18200,
    status: "In Stock",
  },
  {
    id: "4",
    product: "Wireless Mouse",
    sku: "MELE-ACCS-TMOU-BLOG-MWM1-VBLK",
    warehouse: "Accra Store",
    category: "Accessories",
    quantity: 32,
    reserved: 4,
    minimumStock: 10,
    value: 1600,
    status: "In Stock",
  },
  {
    id: "5",
    product: "USB-C Cable",
    sku: "MELE-ACCS-TCAB-BANK-MUC1-V1M",
    warehouse: "Accra Store",
    category: "Accessories",
    quantity: 0,
    reserved: 0,
    minimumStock: 10,
    value: 0,
    status: "Out of Stock",
  },
  {
    id: "6",
    product: "Samsung 55-inch TV",
    sku: "MELE-TVTV-TTV-BSAM-M55Q-V4K",
    warehouse: "Kumasi Warehouse",
    category: "Televisions",
    quantity: 11,
    reserved: 2,
    minimumStock: 5,
    value: 9900,
    status: "In Stock",
  },
];

const initialMovements: StockMovement[] = [
  {
    id: "1",
    date: "2026-10-01 09:42",
    product: "Galaxy S24",
    type: "Purchase",
    quantity: 20,
    warehouse: "Main Warehouse",
    reference: "PO-0012",
    user: "Admin",
  },
  {
    id: "2",
    date: "2026-10-01 09:15",
    product: "iPhone 15",
    type: "Sale",
    quantity: -2,
    warehouse: "Main Warehouse",
    reference: "SO-0041",
    user: "Admin",
  },
  {
    id: "3",
    date: "2026-09-30 16:30",
    product: "Galaxy S24",
    type: "Adjustment",
    quantity: -1,
    warehouse: "Main Warehouse",
    reference: "ADJ-002",
    user: "Manager",
  },
  {
    id: "4",
    date: "2026-09-30 14:18",
    product: "Wireless Mouse",
    type: "Transfer",
    quantity: 10,
    warehouse: "Accra Store",
    reference: "TR-0008",
    user: "Admin",
  },
  {
    id: "5",
    date: "2026-09-29 11:05",
    product: "MacBook Air M3",
    type: "Purchase",
    quantity: 8,
    warehouse: "Main Warehouse",
    reference: "PO-0011",
    user: "Admin",
  },
];

const warehouses = [
  "All Warehouses",
  "Main Warehouse",
  "Accra Store",
  "Kumasi Warehouse",
];

const categories = [
  "All Categories",
  "Smartphones",
  "Laptops",
  "Accessories",
  "Televisions",
];

const statuses = [
  "All Statuses",
  "In Stock",
  "Low Stock",
  "Out of Stock",
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 0,
  }).format(value);

const getStatusClass = (status: StockStatus) => {
  if (status === "In Stock") {
    return styles.statusInStock;
  }

  if (status === "Low Stock") {
    return styles.statusLowStock;
  }

  return styles.statusOutOfStock;
};

const Stocks = () => {
  const [stock, setStock] = useState<StockItem[]>(initialStock);
  const [movements, setMovements] =
    useState<StockMovement[]>(initialMovements);

  const [search, setSearch] = useState("");
  const [warehouseFilter, setWarehouseFilter] =
    useState("All Warehouses");
  const [categoryFilter, setCategoryFilter] =
    useState("All Categories");
  const [statusFilter, setStatusFilter] =
    useState("All Statuses");

  const [selectedItem, setSelectedItem] =
    useState<StockItem | null>(null);
  const [isAdjustmentOpen, setIsAdjustmentOpen] =
    useState(false);

  const [adjustmentType, setAdjustmentType] =
    useState<"add" | "remove">("add");
  const [adjustmentQuantity, setAdjustmentQuantity] =
    useState("");
  const [adjustmentReason, setAdjustmentReason] =
    useState("");

  const totals = useMemo(() => {
    const totalQuantity = stock.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    const lowStock = stock.filter(
      (item) => item.status === "Low Stock",
    ).length;

    const outOfStock = stock.filter(
      (item) => item.status === "Out of Stock",
    ).length;

    const stockValue = stock.reduce(
      (sum, item) => sum + item.value,
      0,
    );

    return {
      totalItems: stock.length,
      totalQuantity,
      lowStock,
      outOfStock,
      stockValue,
    };
  }, [stock]);

  const filteredStock = useMemo(() => {
    const query = search.trim().toLowerCase();

    return stock.filter((item) => {
      const matchesSearch =
        !query ||
        item.product.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query);

      const matchesWarehouse =
        warehouseFilter === "All Warehouses" ||
        item.warehouse === warehouseFilter;

      const matchesCategory =
        categoryFilter === "All Categories" ||
        item.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All Statuses" ||
        item.status === statusFilter;

      return (
        matchesSearch &&
        matchesWarehouse &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    stock,
    search,
    warehouseFilter,
    categoryFilter,
    statusFilter,
  ]);

  const openAdjustment = (item: StockItem) => {
    setSelectedItem(item);
    setAdjustmentType("add");
    setAdjustmentQuantity("");
    setAdjustmentReason("");
    setIsAdjustmentOpen(true);
  };

  const closeAdjustment = () => {
    setIsAdjustmentOpen(false);
    setSelectedItem(null);
    setAdjustmentQuantity("");
    setAdjustmentReason("");
  };

  const handleAdjustment = () => {
    if (
      !selectedItem ||
      !adjustmentQuantity ||
      !adjustmentReason.trim()
    ) {
      return;
    }

    const quantity = Number(adjustmentQuantity);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      return;
    }

    const change =
      adjustmentType === "add" ? quantity : -quantity;

    setStock((current) =>
      current.map((item) => {
        if (item.id !== selectedItem.id) {
          return item;
        }

        const nextQuantity = Math.max(
          0,
          item.quantity + change,
        );

        const nextStatus: StockStatus =
          nextQuantity === 0
            ? "Out of Stock"
            : nextQuantity <= item.minimumStock
              ? "Low Stock"
              : "In Stock";

        return {
          ...item,
          quantity: nextQuantity,
          value:
            nextQuantity === 0
              ? 0
              : (item.value / Math.max(item.quantity, 1)) *
                nextQuantity,
          status: nextStatus,
        };
      }),
    );

    const movement: StockMovement = {
      id: crypto.randomUUID(),
      date: new Date().toLocaleString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      product: selectedItem.product,
      type: "Adjustment",
      quantity: change,
      warehouse: selectedItem.warehouse,
      reference: `ADJ-${String(movements.length + 1).padStart(
        4,
        "0",
      )}`,
      user: "Admin",
    };

    setMovements((current) => [movement, ...current]);
    closeAdjustment();
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>Stock</h1>
          <p>
            Monitor inventory levels and stock movements across
            your warehouses.
          </p>
        </div>

        <button
          type="button"
          className={styles.primaryButton}
          onClick={() => {
            const firstItem = filteredStock[0] ?? stock[0];

            if (firstItem) {
              openAdjustment(firstItem);
            }
          }}
        >
          <SlidersHorizontal size={17} aria-hidden="true" />
          Adjust Stock
        </button>
      </header>

      <section className={styles.summaryGrid}>
        <article className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <Package size={19} aria-hidden="true" />
          </div>

          <div>
            <span>Total Items</span>
            <strong>{totals.totalItems}</strong>
          </div>
        </article>

        <article className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <ClipboardList size={19} aria-hidden="true" />
          </div>

          <div>
            <span>Total Quantity</span>
            <strong>{totals.totalQuantity}</strong>
          </div>
        </article>

        <article className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <TriangleAlert size={19} aria-hidden="true" />
          </div>

          <div>
            <span>Low Stock</span>
            <strong>{totals.lowStock}</strong>
          </div>
        </article>

        <article className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <TriangleAlert size={19} aria-hidden="true" />
          </div>

          <div>
            <span>Out of Stock</span>
            <strong>{totals.outOfStock}</strong>
          </div>
        </article>

        <article className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <Package size={19} aria-hidden="true" />
          </div>

          <div>
            <span>Stock Value</span>
            <strong>{formatCurrency(totals.stockValue)}</strong>
          </div>
        </article>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2>Current Stock</h2>
            <span>
              {filteredStock.length} inventory item
              {filteredStock.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        <div className={styles.filters}>
          <div className={styles.search}>
            <Search
              className={styles.searchIcon}
              size={18}
              aria-hidden="true"
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search products or SKU..."
              aria-label="Search products or SKU"
            />
          </div>

          <label className={styles.selectWrapper}>
            <span className={styles.srOnly}>Warehouse</span>
            <select
              value={warehouseFilter}
              onChange={(event) =>
                setWarehouseFilter(event.target.value)
              }
            >
              {warehouses.map((warehouse) => (
                <option key={warehouse} value={warehouse}>
                  {warehouse}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              aria-hidden="true"
            />
          </label>

          <label className={styles.selectWrapper}>
            <span className={styles.srOnly}>Category</span>
            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(event.target.value)
              }
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              aria-hidden="true"
            />
          </label>

          <label className={styles.selectWrapper}>
            <span className={styles.srOnly}>Stock status</span>
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              aria-hidden="true"
            />
          </label>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Warehouse</th>
                <th>Quantity</th>
                <th>Reserved</th>
                <th>Available</th>
                <th>Status</th>
                <th>Value</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredStock.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className={styles.productName}>
                      <strong>{item.product}</strong>
                      <span>{item.category}</span>
                    </div>
                  </td>

                  <td>
                    <span className={styles.sku}>
                      {item.sku}
                    </span>
                  </td>

                  <td>{item.warehouse}</td>

                  <td className={styles.quantity}>
                    {item.quantity}
                  </td>

                  <td>{item.reserved}</td>

                  <td className={styles.quantity}>
                    {Math.max(
                      0,
                      item.quantity - item.reserved,
                    )}
                  </td>

                  <td>
                    <span
                      className={`${styles.status} ${getStatusClass(
                        item.status,
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td>{formatCurrency(item.value)}</td>

                  <td>
                    <button
                      type="button"
                      className={styles.actionButton}
                      onClick={() => openAdjustment(item)}
                    >
                      Adjust
                    </button>
                  </td>
                </tr>
              ))}

              {filteredStock.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className={styles.emptyCell}
                  >
                    <Package
                      size={32}
                      aria-hidden="true"
                    />
                    <strong>No stock found</strong>
                    <span>
                      Try changing your search or filters.
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2>Stock Movements</h2>
            <span>
              Recent changes to your inventory
            </span>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Product</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Warehouse</th>
                <th>Reference</th>
                <th>User</th>
              </tr>
            </thead>

            <tbody>
              {movements.map((movement) => (
                <tr key={movement.id}>
                  <td>{movement.date}</td>

                  <td>
                    <strong className={styles.movementProduct}>
                      {movement.product}
                    </strong>
                  </td>

                  <td>
                    <span className={styles.movementType}>
                      {movement.type}
                    </span>
                  </td>

                  <td>
                    <span
                      className={
                        movement.quantity >= 0
                          ? styles.quantityIn
                          : styles.quantityOut
                      }
                    >
                      {movement.quantity >= 0 ? "+" : ""}
                      {movement.quantity}
                    </span>
                  </td>

                  <td>{movement.warehouse}</td>
                  <td>{movement.reference}</td>
                  <td>{movement.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {isAdjustmentOpen && selectedItem && (
        <div
          className={styles.modalOverlay}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeAdjustment();
            }
          }}
        >
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="adjust-stock-title"
          >
            <header className={styles.modalHeader}>
              <div>
                <h2 id="adjust-stock-title">
                  Adjust Stock
                </h2>
                <p>
                  Update the inventory quantity for this
                  product.
                </p>
              </div>

              <button
                type="button"
                className={styles.closeButton}
                onClick={closeAdjustment}
                aria-label="Close adjustment dialog"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </header>

            <div className={styles.modalContent}>
              <div className={styles.productSummary}>
                <div>
                  <strong>{selectedItem.product}</strong>
                  <span>{selectedItem.sku}</span>
                </div>

                <div>
                  <small>Current Stock</small>
                  <strong>{selectedItem.quantity}</strong>
                </div>
              </div>

              <div className={styles.adjustmentTypes}>
                <button
                  type="button"
                  className={
                    adjustmentType === "add"
                      ? styles.adjustmentTypeActive
                      : styles.adjustmentType
                  }
                  onClick={() =>
                    setAdjustmentType("add")
                  }
                >
                  <ArrowDownToLine
                    size={18}
                    aria-hidden="true"
                  />
                  <span>
                    <strong>Add Stock</strong>
                    <small>Increase inventory</small>
                  </span>
                </button>

                <button
                  type="button"
                  className={
                    adjustmentType === "remove"
                      ? styles.adjustmentTypeActive
                      : styles.adjustmentType
                  }
                  onClick={() =>
                    setAdjustmentType("remove")
                  }
                >
                  <ArrowUpFromLine
                    size={18}
                    aria-hidden="true"
                  />
                  <span>
                    <strong>Remove Stock</strong>
                    <small>Decrease inventory</small>
                  </span>
                </button>
              </div>

              <label className={styles.formField}>
                <span>Quantity</span>
                <input
                  type="number"
                  min="1"
                  value={adjustmentQuantity}
                  onChange={(event) =>
                    setAdjustmentQuantity(
                      event.target.value,
                    )
                  }
                  placeholder="Enter quantity"
                />
              </label>

              <label className={styles.formField}>
                <span>Reason</span>
                <textarea
                  value={adjustmentReason}
                  onChange={(event) =>
                    setAdjustmentReason(
                      event.target.value,
                    )
                  }
                  placeholder="Why is the stock being adjusted?"
                  rows={3}
                />
              </label>
            </div>

            <footer className={styles.modalFooter}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={closeAdjustment}
              >
                Cancel
              </button>

              <button
                type="button"
                className={styles.primaryButton}
                onClick={handleAdjustment}
              >
                Save Adjustment
              </button>
            </footer>
          </section>
        </div>
      )}
    </main>
  );
};

export default Stocks;