import { useMemo, useState } from "react";
import {
  Building2,
  MapPin,
  Pencil,
  Plus,
  Search,
  Trash2,
  Warehouse as WarehouseIcon,
  X,
} from "lucide-react";
import styles from "./Warehouses.module.css";

type WarehouseStatus = "Active" | "Inactive";

type Warehouse = {
  id: string;
  name: string;
  code: string;
  location: string;
  description: string;
  status: WarehouseStatus;
  totalProducts: number;
  totalQuantity: number;
  createdAt: string;
};

type WarehouseForm = {
  name: string;
  code: string;
  location: string;
  description: string;
  status: WarehouseStatus;
};

const initialWarehouses: Warehouse[] = [
  {
    id: "1",
    name: "Main Warehouse",
    code: "WH-MAIN",
    location: "Accra, Greater Accra",
    description: "Primary storage and distribution warehouse.",
    status: "Active",
    totalProducts: 128,
    totalQuantity: 2840,
    createdAt: "2026-09-01",
  },
  {
    id: "2",
    name: "Accra Store",
    code: "WH-ACCRA",
    location: "Osu, Accra",
    description: "Retail stock location for Accra operations.",
    status: "Active",
    totalProducts: 74,
    totalQuantity: 1260,
    createdAt: "2026-09-10",
  },
  {
    id: "3",
    name: "Kumasi Warehouse",
    code: "WH-KUMASI",
    location: "Kumasi, Ashanti Region",
    description: "Regional warehouse serving the Kumasi area.",
    status: "Active",
    totalProducts: 52,
    totalQuantity: 720,
    createdAt: "2026-09-15",
  },
  {
    id: "4",
    name: "Tema Storage",
    code: "WH-TEMA",
    location: "Tema, Greater Accra",
    description: "Temporary storage facility.",
    status: "Inactive",
    totalProducts: 0,
    totalQuantity: 0,
    createdAt: "2026-09-20",
  },
];

const emptyForm: WarehouseForm = {
  name: "",
  code: "",
  location: "",
  description: "",
  status: "Active",
};

const Warehouses = () => {
  const [warehouses, setWarehouses] =
    useState<Warehouse[]>(initialWarehouses);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"All" | WarehouseStatus>("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] =
    useState<Warehouse | null>(null);

  const [form, setForm] = useState<WarehouseForm>(emptyForm);
  const [formError, setFormError] = useState("");

  const totals = useMemo(() => {
    const active = warehouses.filter(
      (warehouse) => warehouse.status === "Active",
    ).length;

    const totalProducts = warehouses.reduce(
      (sum, warehouse) => sum + warehouse.totalProducts,
      0,
    );

    const totalQuantity = warehouses.reduce(
      (sum, warehouse) => sum + warehouse.totalQuantity,
      0,
    );

    return {
      total: warehouses.length,
      active,
      inactive: warehouses.length - active,
      totalProducts,
      totalQuantity,
    };
  }, [warehouses]);

  const filteredWarehouses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return warehouses.filter((warehouse) => {
      const matchesSearch =
        !query ||
        warehouse.name.toLowerCase().includes(query) ||
        warehouse.code.toLowerCase().includes(query) ||
        warehouse.location.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        warehouse.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [warehouses, search, statusFilter]);

  const openCreateModal = () => {
    setEditingWarehouse(null);
    setForm(emptyForm);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);

    setForm({
      name: warehouse.name,
      code: warehouse.code,
      location: warehouse.location,
      description: warehouse.description,
      status: warehouse.status,
    });

    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingWarehouse(null);
    setForm(emptyForm);
    setFormError("");
  };

  const updateForm = <K extends keyof WarehouseForm>(
    field: K,
    value: WarehouseForm[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    const name = form.name.trim();
    const code = form.code.trim().toUpperCase();
    const location = form.location.trim();
    const description = form.description.trim();

    if (!name || !code || !location) {
      setFormError(
        "Warehouse name, code, and location are required.",
      );
      return;
    }

    const duplicateCode = warehouses.some(
      (warehouse) =>
        warehouse.id !== editingWarehouse?.id &&
        warehouse.code.toLowerCase() === code.toLowerCase(),
    );

    if (duplicateCode) {
      setFormError(
        "A warehouse with this code already exists.",
      );
      return;
    }

    const now = new Date().toISOString();

    if (editingWarehouse) {
      setWarehouses((current) =>
        current.map((warehouse) =>
          warehouse.id === editingWarehouse.id
            ? {
                ...warehouse,
                name,
                code,
                location,
                description,
                status: form.status,
              }
            : warehouse,
        ),
      );
    } else {
      const newWarehouse: Warehouse = {
        id: crypto.randomUUID(),
        name,
        code,
        location,
        description,
        status: form.status,
        totalProducts: 0,
        totalQuantity: 0,
        createdAt: now,
      };

      setWarehouses((current) => [
        newWarehouse,
        ...current,
      ]);
    }

    closeModal();
  };

  const handleDelete = (warehouse: Warehouse) => {
    if (
      warehouse.totalProducts > 0 ||
      warehouse.totalQuantity > 0
    ) {
      return;
    }

    setWarehouses((current) =>
      current.filter(
        (item) => item.id !== warehouse.id,
      ),
    );
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>Warehouses</h1>
          <p>
            Manage your storage locations and warehouse
            information.
          </p>
        </div>

        <button
          type="button"
          className={styles.primaryButton}
          onClick={openCreateModal}
        >
          <Plus size={18} aria-hidden="true" />
          Add Warehouse
        </button>
      </header>

      <section className={styles.summaryGrid}>
        <article className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <WarehouseIcon
              size={19}
              aria-hidden="true"
            />
          </div>

          <div>
            <span>Total Warehouses</span>
            <strong>{totals.total}</strong>
          </div>
        </article>

        <article className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <Building2
              size={19}
              aria-hidden="true"
            />
          </div>

          <div>
            <span>Active</span>
            <strong>{totals.active}</strong>
          </div>
        </article>

        <article className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <Building2
              size={19}
              aria-hidden="true"
            />
          </div>

          <div>
            <span>Inactive</span>
            <strong>{totals.inactive}</strong>
          </div>
        </article>

        <article className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <WarehouseIcon
              size={19}
              aria-hidden="true"
            />
          </div>

          <div>
            <span>Products Stored</span>
            <strong>{totals.totalProducts}</strong>
          </div>
        </article>

        <article className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <WarehouseIcon
              size={19}
              aria-hidden="true"
            />
          </div>

          <div>
            <span>Total Quantity</span>
            <strong>{totals.totalQuantity}</strong>
          </div>
        </article>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2>Warehouse List</h2>
            <span>
              {filteredWarehouses.length} warehouse
              {filteredWarehouses.length === 1
                ? ""
                : "s"}
            </span>
          </div>
        </div>

        <div className={styles.toolbar}>
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
              placeholder="Search warehouses..."
              aria-label="Search warehouses"
            />
          </div>

          <div className={styles.statusFilters}>
            {(["All", "Active", "Inactive"] as const).map(
              (status) => (
                <button
                  key={status}
                  type="button"
                  className={
                    statusFilter === status
                      ? styles.filterActive
                      : styles.filterButton
                  }
                  onClick={() =>
                    setStatusFilter(status)
                  }
                >
                  {status}
                </button>
              ),
            )}
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Warehouse</th>
                <th>Code</th>
                <th>Location</th>
                <th>Products</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredWarehouses.map((warehouse) => (
                <tr key={warehouse.id}>
                  <td>
                    <div className={styles.warehouseName}>
                      <div className={styles.warehouseIcon}>
                        <WarehouseIcon
                          size={18}
                          aria-hidden="true"
                        />
                      </div>

                      <div>
                        <strong>
                          {warehouse.name}
                        </strong>

                        <span>
                          {warehouse.description ||
                            "No description"}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className={styles.code}>
                      {warehouse.code}
                    </span>
                  </td>

                  <td>
                    <div className={styles.location}>
                      <MapPin
                        size={15}
                        aria-hidden="true"
                      />
                      {warehouse.location}
                    </div>
                  </td>

                  <td>{warehouse.totalProducts}</td>

                  <td>{warehouse.totalQuantity}</td>

                  <td>
                    <span
                      className={`${styles.status} ${
                        warehouse.status === "Active"
                          ? styles.statusActive
                          : styles.statusInactive
                      }`}
                    >
                      {warehouse.status}
                    </span>
                  </td>

                  <td>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.iconButton}
                        onClick={() =>
                          openEditModal(warehouse)
                        }
                        aria-label={`Edit ${warehouse.name}`}
                        title="Edit warehouse"
                      >
                        <Pencil
                          size={16}
                          aria-hidden="true"
                        />
                      </button>

                      <button
                        type="button"
                        className={styles.iconButton}
                        onClick={() =>
                          handleDelete(warehouse)
                        }
                        disabled={
                          warehouse.totalProducts > 0 ||
                          warehouse.totalQuantity > 0
                        }
                        aria-label={`Delete ${warehouse.name}`}
                        title={
                          warehouse.totalProducts > 0 ||
                          warehouse.totalQuantity > 0
                            ? "Warehouse must be empty before deletion"
                            : "Delete warehouse"
                        }
                      >
                        <Trash2
                          size={16}
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredWarehouses.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className={styles.empty}
                  >
                    <WarehouseIcon
                      size={34}
                      aria-hidden="true"
                    />
                    <strong>
                      No warehouses found
                    </strong>
                    <span>
                      Try changing your search or filter.
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isModalOpen && (
        <div
          className={styles.modalOverlay}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="warehouse-modal-title"
          >
            <header className={styles.modalHeader}>
              <div>
                <h2 id="warehouse-modal-title">
                  {editingWarehouse
                    ? "Edit Warehouse"
                    : "Add Warehouse"}
                </h2>

                <p>
                  {editingWarehouse
                    ? "Update the warehouse information."
                    : "Create a new storage location."}
                </p>
              </div>

              <button
                type="button"
                className={styles.closeButton}
                onClick={closeModal}
                aria-label="Close warehouse dialog"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </header>

            <div className={styles.form}>
              {formError && (
                <div
                  className={styles.formError}
                  role="alert"
                >
                  {formError}
                </div>
              )}

              <div className={styles.formGrid}>
                <label className={styles.field}>
                  <span>Warehouse Name</span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                      updateForm(
                        "name",
                        event.target.value,
                      )
                    }
                    placeholder="e.g. Main Warehouse"
                  />
                </label>

                <label className={styles.field}>
                  <span>Warehouse Code</span>
                  <input
                    type="text"
                    value={form.code}
                    onChange={(event) =>
                      updateForm(
                        "code",
                        event.target.value.toUpperCase(),
                      )
                    }
                    placeholder="e.g. WH-MAIN"
                    maxLength={20}
                  />
                </label>
              </div>

              <label className={styles.field}>
                <span>Location</span>
                <input
                  type="text"
                  value={form.location}
                  onChange={(event) =>
                    updateForm(
                      "location",
                      event.target.value,
                    )
                  }
                  placeholder="e.g. Accra, Greater Accra"
                />
              </label>

              <label className={styles.field}>
                <span>Description</span>
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    updateForm(
                      "description",
                      event.target.value,
                    )
                  }
                  placeholder="Describe this warehouse..."
                  rows={4}
                />
              </label>

              <label className={styles.field}>
                <span>Status</span>
                <select
                  value={form.status}
                  onChange={(event) =>
                    updateForm(
                      "status",
                      event.target
                        .value as WarehouseStatus,
                    )
                  }
                >
                  <option value="Active">
                    Active
                  </option>
                  <option value="Inactive">
                    Inactive
                  </option>
                </select>
              </label>
            </div>

            <footer className={styles.modalFooter}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={closeModal}
              >
                Cancel
              </button>

              <button
                type="button"
                className={styles.primaryButton}
                onClick={handleSubmit}
              >
                {editingWarehouse
                  ? "Save Changes"
                  : "Create Warehouse"}
              </button>
            </footer>
          </section>
        </div>
      )}
    </main>
  );
};

export default Warehouses;