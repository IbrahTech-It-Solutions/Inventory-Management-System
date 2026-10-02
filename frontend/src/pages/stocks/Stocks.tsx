import { useMemo, useState } from "react";
import {
  ChevronDown,
  Edit3,
  Package,
  Plus,
  Search,
  Trash2,
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

type StockForm = {
  product: string;
  warehouse: string;
  quantity: string;
  minimumStock: string;
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

const productOptions = [
  {
    value: "Galaxy S24",
    label: "Galaxy S24",
    sku: "MELE-SSMA-TSMT-BSAM-MGY4-V256",
    category: "Smartphones",
    unitValue: 850,
  },
  {
    value: "iPhone 15",
    label: "iPhone 15",
    sku: "MELE-SSMA-TSMT-BAPP-MIP5-V128",
    category: "Smartphones",
    unitValue: 1150,
  },
  {
    value: "MacBook Air M3",
    label: "MacBook Air M3",
    sku: "MELE-CLPT-TLAP-BAPP-MM3A-V256",
    category: "Laptops",
    unitValue: 1300,
  },
  {
    value: "Wireless Mouse",
    label: "Wireless Mouse",
    sku: "MELE-ACCS-TMOU-BLOG-MWM1-VBLK",
    category: "Accessories",
    unitValue: 50,
  },
  {
    value: "USB-C Cable",
    label: "USB-C Cable",
    sku: "MELE-ACCS-TCAB-BANK-MUC1-V1M",
    category: "Accessories",
    unitValue: 25,
  },
  {
    value: "Samsung 55-inch TV",
    label: "Samsung 55-inch TV",
    sku: "MELE-TVTV-TTV-BSAM-M55Q-V4K",
    category: "Televisions",
    unitValue: 900,
  },
];

const warehouses = [
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

const emptyForm: StockForm = {
  product: "",
  warehouse: "",
  quantity: "",
  minimumStock: "",
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 0,
  }).format(value);

const getStockStatus = (
  quantity: number,
  minimumStock: number,
): StockStatus => {
  if (quantity <= 0) {
    return "Out of Stock";
  }

  if (quantity <= minimumStock) {
    return "Low Stock";
  }

  return "In Stock";
};

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

  const [search, setSearch] = useState("");
  const [warehouseFilter, setWarehouseFilter] =
    useState("All Warehouses");
  const [categoryFilter, setCategoryFilter] =
    useState("All Categories");
  const [statusFilter, setStatusFilter] =
    useState("All Statuses");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] =
    useState<StockItem | null>(null);
  const [form, setForm] = useState<StockForm>(emptyForm);
  const [formError, setFormError] = useState("");

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

  const openCreateForm = () => {
    setEditingItem(null);
    setForm(emptyForm);
    setFormError("");
    setIsFormOpen(true);
  };

  const openEditForm = (item: StockItem) => {
    setEditingItem(item);

    setForm({
      product: item.product,
      warehouse: item.warehouse,
      quantity: String(item.quantity),
      minimumStock: String(item.minimumStock),
    });

    setFormError("");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
    setForm(emptyForm);
    setFormError("");
  };

  const handleProductChange = (product: string) => {
    setForm((current) => ({
      ...current,
      product,
    }));
    setFormError("");
  };

  const handleFormChange = (
    field: keyof StockForm,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setFormError("");
  };

  const handleSubmit = () => {
    const quantity = Number(form.quantity);
    const minimumStock = Number(form.minimumStock);

    if (!form.product || !form.warehouse) {
      setFormError(
        "Product and warehouse are required.",
      );
      return;
    }

    if (
      !Number.isFinite(quantity) ||
      quantity < 0
    ) {
      setFormError(
        "Quantity must be zero or greater.",
      );
      return;
    }

    if (
      !Number.isFinite(minimumStock) ||
      minimumStock < 0
    ) {
      setFormError(
        "Minimum stock must be zero or greater.",
      );
      return;
    }

    const product = productOptions.find(
      (item) => item.value === form.product,
    );

    if (!product) {
      setFormError("Selected product could not be found.");
      return;
    }

    if (!editingItem) {
      const alreadyExists = stock.some(
        (item) =>
          item.product === form.product &&
          item.warehouse === form.warehouse,
      );

      if (alreadyExists) {
        setFormError(
          "This product already has a stock record in the selected warehouse.",
        );
        return;
      }

      const newStock: StockItem = {
        id: crypto.randomUUID(),
        product: product.label,
        sku: product.sku,
        warehouse: form.warehouse,
        category: product.category,
        quantity,
        reserved: 0,
        minimumStock,
        value: quantity * product.unitValue,
        status: getStockStatus(
          quantity,
          minimumStock,
        ),
      };

      setStock((current) => [newStock, ...current]);
      closeForm();
      return;
    }

    setStock((current) =>
      current.map((item) => {
        if (item.id !== editingItem.id) {
          return item;
        }

        const nextStatus = getStockStatus(
          item.quantity,
          minimumStock,
        );

        return {
          ...item,
          minimumStock,
          status: nextStatus,
        };
      }),
    );

    closeForm();
  };

  const handleDelete = (item: StockItem) => {
    const confirmed = window.confirm(
      `Delete the stock record for ${item.product} in ${item.warehouse}?`,
    );

    if (!confirmed) {
      return;
    }

    setStock((current) =>
      current.filter((stockItem) => stockItem.id !== item.id),
    );
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>Stock</h1>
          <p>
            Manage product stock records across your
            warehouses.
          </p>
        </div>

        <button
          type="button"
          className={styles.primaryButton}
          onClick={openCreateForm}
        >
          <Plus size={17} aria-hidden="true" />
          Create Stock
        </button>
      </header>

      <section className={styles.summaryGrid}>
        <article className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <Package size={19} aria-hidden="true" />
          </div>

          <div>
            <span>Stock Records</span>
            <strong>{totals.totalItems}</strong>
          </div>
        </article>

        <article className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <Package size={19} aria-hidden="true" />
          </div>

          <div>
            <span>Total Quantity</span>
            <strong>{totals.totalQuantity}</strong>
          </div>
        </article>

        <article className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <Package size={19} aria-hidden="true" />
          </div>

          <div>
            <span>Low Stock</span>
            <strong>{totals.lowStock}</strong>
          </div>
        </article>

        <article className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <Package size={19} aria-hidden="true" />
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
            <strong>
              {formatCurrency(totals.stockValue)}
            </strong>
          </div>
        </article>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2>Current Stock</h2>
            <span>
              {filteredStock.length} stock record
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
            <span className={styles.srOnly}>
              Warehouse
            </span>

            <select
              value={warehouseFilter}
              onChange={(event) =>
                setWarehouseFilter(event.target.value)
              }
            >
              <option value="All Warehouses">
                All Warehouses
              </option>

              {warehouses.map((warehouse) => (
                <option
                  key={warehouse}
                  value={warehouse}
                >
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
            <span className={styles.srOnly}>
              Category
            </span>

            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(event.target.value)
              }
            >
              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
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
            <span className={styles.srOnly}>
              Stock status
            </span>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
            >
              {statuses.map((status) => (
                <option
                  key={status}
                  value={status}
                >
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
                <th>Minimum</th>
                <th>Status</th>
                <th>Value</th>
                <th>Actions</th>
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

                  <td>{item.minimumStock}</td>

                  <td>
                    <span
                      className={`${styles.status} ${getStatusClass(
                        item.status,
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td>
                    {formatCurrency(item.value)}
                  </td>

                  <td>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.actionButton}
                        onClick={() =>
                          openEditForm(item)
                        }
                        aria-label={`Edit ${item.product} stock`}
                      >
                        <Edit3
                          size={15}
                          aria-hidden="true"
                        />
                        Edit
                      </button>

                      <button
                        type="button"
                        className={
                          styles.deleteButton
                        }
                        onClick={() =>
                          handleDelete(item)
                        }
                        aria-label={`Delete ${item.product} stock`}
                      >
                        <Trash2
                          size={15}
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredStock.length === 0 && (
                <tr>
                  <td
                    colSpan={10}
                    className={styles.emptyCell}
                  >
                    <Package
                      size={32}
                      aria-hidden="true"
                    />

                    <strong>No stock found</strong>

                    <span>
                      Try changing your search or
                      filters.
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isFormOpen && (
        <div
          className={styles.modalOverlay}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeForm();
            }
          }}
        >
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="stock-form-title"
          >
            <header className={styles.modalHeader}>
              <div>
                <h2 id="stock-form-title">
                  {editingItem
                    ? "Edit Stock"
                    : "Create Stock"}
                </h2>

                <p>
                  {editingItem
                    ? "Update the stock record settings."
                    : "Create a stock record for a product in a warehouse."}
                </p>
              </div>

              <button
                type="button"
                className={styles.closeButton}
                onClick={closeForm}
                aria-label="Close stock form"
              >
                <X
                  size={18}
                  aria-hidden="true"
                />
              </button>
            </header>

            <div className={styles.modalContent}>
              {formError && (
                <div
                  className={styles.formError}
                  role="alert"
                >
                  {formError}
                </div>
              )}

              <label className={styles.formField}>
                <span>
                  Product
                  <b>*</b>
                </span>

                <select
                  value={form.product}
                  onChange={(event) =>
                    handleProductChange(
                      event.target.value,
                    )
                  }
                  disabled={Boolean(editingItem)}
                >
                  <option value="">
                    Select product
                  </option>

                  {productOptions.map((product) => (
                    <option
                      key={product.value}
                      value={product.value}
                    >
                      {product.label}
                    </option>
                  ))}
                </select>
              </label>

              {form.product && (
                <div className={styles.productInfo}>
                  {(() => {
                    const product =
                      productOptions.find(
                        (item) =>
                          item.value === form.product,
                      );

                    if (!product) {
                      return null;
                    }

                    return (
                      <>
                        <span>
                          SKU: {product.sku}
                        </span>
                        <span>
                          Category: {product.category}
                        </span>
                      </>
                    );
                  })()}
                </div>
              )}

              <label className={styles.formField}>
                <span>
                  Warehouse
                  <b>*</b>
                </span>

                <select
                  value={form.warehouse}
                  onChange={(event) =>
                    handleFormChange(
                      "warehouse",
                      event.target.value,
                    )
                  }
                  disabled={Boolean(editingItem)}
                >
                  <option value="">
                    Select warehouse
                  </option>

                  {warehouses.map((warehouse) => (
                    <option
                      key={warehouse}
                      value={warehouse}
                    >
                      {warehouse}
                    </option>
                  ))}
                </select>
              </label>

              <div className={styles.formGrid}>
                <label className={styles.formField}>
                  <span>
                    {editingItem
                      ? "Current Quantity"
                      : "Opening Quantity"}
                    {!editingItem && <b>*</b>}
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={form.quantity}
                    onChange={(event) =>
                      handleFormChange(
                        "quantity",
                        event.target.value,
                      )
                    }
                    disabled={Boolean(editingItem)}
                    placeholder="0"
                  />

                  {editingItem && (
                    <small>
                      Quantity is changed through stock
                      movements.
                    </small>
                  )}
                </label>

                <label className={styles.formField}>
                  <span>Minimum Stock</span>

                  <input
                    type="number"
                    min="0"
                    value={form.minimumStock}
                    onChange={(event) =>
                      handleFormChange(
                        "minimumStock",
                        event.target.value,
                      )
                    }
                    placeholder="0"
                  />

                  <small>
                    Used to determine low-stock status.
                  </small>
                </label>
              </div>
            </div>

            <footer className={styles.modalFooter}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={closeForm}
              >
                Cancel
              </button>

              <button
                type="button"
                className={styles.primaryButton}
                onClick={handleSubmit}
              >
                {editingItem
                  ? "Save Changes"
                  : "Create Stock"}
              </button>
            </footer>
          </section>
        </div>
      )}
    </main>
  );
};

export default Stocks;