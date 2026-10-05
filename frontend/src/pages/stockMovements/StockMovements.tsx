import { useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  Boxes,
  ChevronRight,
  ClipboardList,
  Eye,
  Filter,
  Package,
  Search,
  Warehouse,
  X,
} from "lucide-react";
import Button from "../../components/ui/button/Button";
import Modal from "../../components/ui/modal/Modal";
import Select from "../../components/ui/select/Select";
import styles from "./StockMovements.module.css";

type MovementType =
  | "purchase"
  | "sale"
  | "transfer-in"
  | "transfer-out"
  | "adjustment";

type MovementDirection = "in" | "out";

type StockMovement = {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  warehouseId: string;
  warehouseName: string;
  type: MovementType;
  direction: MovementDirection;
  quantity: number;
  reason: string;
  reference: string;
  createdAt: string;
  createdBy: string;
};

const movements: StockMovement[] = [
  {
    id: "MOV-0001",
    productId: "PRD-001",
    productName: "Samsung Galaxy S24",
    sku: "MELE-SSMA-TSMT-BSAM-MS24-V256",
    warehouseId: "WH-MAIN",
    warehouseName: "Main Warehouse",
    type: "purchase",
    direction: "in",
    quantity: 25,
    reason: "Supplier delivery",
    reference: "PO-10024",
    createdAt: "2026-09-30T10:30:00",
    createdBy: "Admin",
  },
  {
    id: "MOV-0002",
    productId: "PRD-002",
    productName: "Apple iPhone 15",
    sku: "MELE-SIPH-T000-BAPP-M15-V128",
    warehouseId: "WH-ACCRA",
    warehouseName: "Accra Store",
    type: "sale",
    direction: "out",
    quantity: 4,
    reason: "Customer order",
    reference: "ORD-20341",
    createdAt: "2026-09-30T09:15:00",
    createdBy: "Sales",
  },
  {
    id: "MOV-0003",
    productId: "PRD-003",
    productName: "MacBook Air M3",
    sku: "MELE-SCOM-TLAP-BAPP-MM3-V256",
    warehouseId: "WH-MAIN",
    warehouseName: "Main Warehouse",
    type: "transfer-out",
    direction: "out",
    quantity: 6,
    reason: "Warehouse transfer",
    reference: "TRF-0048",
    createdAt: "2026-09-29T15:40:00",
    createdBy: "Admin",
  },
  {
    id: "MOV-0004",
    productId: "PRD-003",
    productName: "MacBook Air M3",
    sku: "MELE-SCOM-TLAP-BAPP-MM3-V256",
    warehouseId: "WH-ACCRA",
    warehouseName: "Accra Store",
    type: "transfer-in",
    direction: "in",
    quantity: 6,
    reason: "Warehouse transfer",
    reference: "TRF-0048",
    createdAt: "2026-09-29T15:40:00",
    createdBy: "Admin",
  },
  {
    id: "MOV-0005",
    productId: "PRD-004",
    productName: "Samsung 55-inch TV",
    sku: "MELE-STEL-TTV-BSAM-M55-V000",
    warehouseId: "WH-KUMASI",
    warehouseName: "Kumasi Warehouse",
    type: "adjustment",
    direction: "in",
    quantity: 3,
    reason: "Stock count correction",
    reference: "ADJ-0012",
    createdAt: "2026-09-28T11:20:00",
    createdBy: "Manager",
  },
  {
    id: "MOV-0006",
    productId: "PRD-005",
    productName: "HP EliteBook 840",
    sku: "MELE-SCOM-TLAP-BHP-M840-V512",
    warehouseId: "WH-MAIN",
    warehouseName: "Main Warehouse",
    type: "sale",
    direction: "out",
    quantity: 8,
    reason: "Customer order",
    reference: "ORD-20320",
    createdAt: "2026-09-27T14:05:00",
    createdBy: "Sales",
  },
  {
    id: "MOV-0007",
    productId: "PRD-006",
    productName: "Anker Power Bank",
    sku: "MELE-SACC-TPOW-BANK-M000-V200",
    warehouseId: "WH-MAIN",
    warehouseName: "Main Warehouse",
    type: "purchase",
    direction: "in",
    quantity: 50,
    reason: "Supplier delivery",
    reference: "PO-10018",
    createdAt: "2026-09-26T08:50:00",
    createdBy: "Admin",
  },
];

const movementTypeOptions = [
  { value: "all", label: "All movement types" },
  { value: "purchase", label: "Purchase" },
  { value: "sale", label: "Sale" },
  { value: "transfer-in", label: "Transfer in" },
  { value: "transfer-out", label: "Transfer out" },
  { value: "adjustment", label: "Adjustment" },
];

const warehouseOptions = [
  { value: "all", label: "All warehouses" },
  { value: "WH-MAIN", label: "Main Warehouse" },
  { value: "WH-ACCRA", label: "Accra Store" },
  { value: "WH-KUMASI", label: "Kumasi Warehouse" },
];

const typeLabels: Record<MovementType, string> = {
  purchase: "Purchase",
  sale: "Sale",
  "transfer-in": "Transfer in",
  "transfer-out": "Transfer out",
  adjustment: "Adjustment",
};

const typeIcons: Record<MovementType, typeof Package> = {
  purchase: ArrowDownLeft,
  sale: ArrowUpRight,
  "transfer-in": ArrowDownLeft,
  "transfer-out": ArrowUpRight,
  adjustment: ArrowLeftRight,
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-GH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

const StockMovements = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [warehouseFilter, setWarehouseFilter] = useState("all");
  const [selectedMovementId, setSelectedMovementId] = useState<string | null>(
    null,
  );
  const [showFilters, setShowFilters] = useState(false);

  const filteredMovements = useMemo(() => {
    const query = search.trim().toLowerCase();

    return movements.filter((movement) => {
      const matchesSearch =
        !query ||
        movement.productName.toLowerCase().includes(query) ||
        movement.sku.toLowerCase().includes(query) ||
        movement.id.toLowerCase().includes(query) ||
        movement.reference.toLowerCase().includes(query);

      const matchesType =
        typeFilter === "all" || movement.type === typeFilter;

      const matchesWarehouse =
        warehouseFilter === "all" ||
        movement.warehouseId === warehouseFilter;

      return matchesSearch && matchesType && matchesWarehouse;
    });
  }, [search, typeFilter, warehouseFilter]);

  const selectedMovement = useMemo(
    () =>
      movements.find((movement) => movement.id === selectedMovementId) ?? null,
    [selectedMovementId],
  );

  const summary = useMemo(
    () => ({
      total: movements.length,
      incoming: movements
        .filter((movement) => movement.direction === "in")
        .reduce((total, movement) => total + movement.quantity, 0),
      outgoing: movements
        .filter((movement) => movement.direction === "out")
        .reduce((total, movement) => total + movement.quantity, 0),
      transfers: movements.filter((movement) =>
        movement.type.startsWith("transfer"),
      ).length,
    }),
    [],
  );

  const hasActiveFilters =
    typeFilter !== "all" || warehouseFilter !== "all";

  const clearFilters = () => {
    setTypeFilter("all");
    setWarehouseFilter("all");
  };

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <div className={styles.breadcrumb}>
            <span>Inventory</span>
            <ChevronRight size={14} />
            <span>Stock Movements</span>
          </div>

          <h1>Stock Movements</h1>
          <p>
            View the complete history of stock entering, leaving, and moving
            between your warehouses.
          </p>
        </div>
      </header>

      <div className={styles.summaryGrid}>
        <article className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <ClipboardList size={20} />
          </div>
          <div>
            <span>Total Movements</span>
            <strong>{summary.total}</strong>
          </div>
        </article>

        <article className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <ArrowDownLeft size={20} />
          </div>
          <div>
            <span>Incoming Units</span>
            <strong>{summary.incoming.toLocaleString()}</strong>
          </div>
        </article>

        <article className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <ArrowUpRight size={20} />
          </div>
          <div>
            <span>Outgoing Units</span>
            <strong>{summary.outgoing.toLocaleString()}</strong>
          </div>
        </article>

        <article className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <ArrowLeftRight size={20} />
          </div>
          <div>
            <span>Transfer Movements</span>
            <strong>{summary.transfers}</strong>
          </div>
        </article>
      </div>

      <div className={styles.contentCard}>
        <div className={styles.toolbar}>
          <div className={styles.searchWrapper}>
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search product, SKU, movement or reference..."
              aria-label="Search stock movements"
            />
          </div>

          <Button
            variant="border"
            onClick={() => setShowFilters((current) => !current)}
          >
            <Filter size={17} />
            Filters
            {hasActiveFilters && (
              <span className={styles.filterCount}>
                {Number(typeFilter !== "all") +
                  Number(warehouseFilter !== "all")}
              </span>
            )}
          </Button>
        </div>

        {showFilters && (
          <div className={styles.filters}>
            <div className={styles.filterField}>
              <Select
                label="Movement Type"
                value={typeFilter}
                options={movementTypeOptions}
                onChange={setTypeFilter}
              />
            </div>

            <div className={styles.filterField}>
              <Select
                label="Warehouse"
                value={warehouseFilter}
                options={warehouseOptions}
                onChange={setWarehouseFilter}
              />
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                className={styles.clearFilters}
                onClick={clearFilters}
              >
                <X size={15} />
                Clear filters
              </button>
            )}
          </div>
        )}

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Movement</th>
                <th>Product</th>
                <th>Warehouse</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Reference</th>
                <th>Date</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {filteredMovements.map((movement) => {
                const Icon = typeIcons[movement.type];

                return (
                  <tr key={movement.id}>
                    <td>
                      <div className={styles.movementId}>
                        <span className={styles.movementIcon}>
                          <Icon size={16} />
                        </span>

                        <div>
                          <strong>{movement.id}</strong>
                          <span>{movement.createdBy}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className={styles.productCell}>
                        <strong>{movement.productName}</strong>
                        <span>{movement.sku}</span>
                      </div>
                    </td>

                    <td>
                      <div className={styles.warehouseCell}>
                        <Warehouse size={15} />
                        {movement.warehouseName}
                      </div>
                    </td>

                    <td>
                      <span
                        className={`${styles.typeBadge} ${
                          styles[movement.direction]
                        }`}
                      >
                        {typeLabels[movement.type]}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`${styles.quantity} ${
                          styles[movement.direction]
                        }`}
                      >
                        {movement.direction === "in" ? "+" : "-"}
                        {movement.quantity.toLocaleString()}
                      </span>
                    </td>

                    <td>
                      <span className={styles.reference}>
                        {movement.reference}
                      </span>
                    </td>

                    <td>
                      <span className={styles.date}>
                        {formatDate(movement.createdAt)}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className={styles.viewButton}
                        onClick={() => setSelectedMovementId(movement.id)}
                        aria-label={`View ${movement.id}`}
                      >
                        <Eye size={17} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredMovements.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <Boxes size={24} />
              </div>

              <h3>No stock movements found</h3>

              <p>
                No movements match your current search or filters.
              </p>

              {hasActiveFilters && (
                <Button variant="border" onClick={clearFilters}>
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </div>

        <div className={styles.tableFooter}>
          Showing <strong>{filteredMovements.length}</strong> of{" "}
          <strong>{movements.length}</strong> movements
        </div>
      </div>

      <Modal
        open={Boolean(selectedMovement)}
        onClose={() => setSelectedMovementId(null)}
        title={selectedMovement?.id ?? "Movement Details"}
        description="Read-only details for this inventory movement."
        footer={
          <Button
            variant="border"
            onClick={() => setSelectedMovementId(null)}
          >
            Close
          </Button>
        }
      >
        {selectedMovement && (
          <div className={styles.details}>
            <div className={styles.detailsHeader}>
              <div className={styles.detailsIcon}>
                {(() => {
                  const Icon = typeIcons[selectedMovement.type];
                  return <Icon size={22} />;
                })()}
              </div>

              <div>
                <strong>{selectedMovement.productName}</strong>
                <span>{selectedMovement.sku}</span>
              </div>
            </div>

            <div className={styles.detailsGrid}>
              <div>
                <span>Movement Type</span>
                <strong>{typeLabels[selectedMovement.type]}</strong>
              </div>

              <div>
                <span>Quantity</span>
                <strong className={styles[selectedMovement.direction]}>
                  {selectedMovement.direction === "in" ? "+" : "-"}
                  {selectedMovement.quantity.toLocaleString()}
                </strong>
              </div>

              <div>
                <span>Warehouse</span>
                <strong>{selectedMovement.warehouseName}</strong>
              </div>

              <div>
                <span>Reference</span>
                <strong>{selectedMovement.reference}</strong>
              </div>

              <div>
                <span>Reason</span>
                <strong>{selectedMovement.reason}</strong>
              </div>

              <div>
                <span>Created By</span>
                <strong>{selectedMovement.createdBy}</strong>
              </div>

              <div>
                <span>Date</span>
                <strong>{formatDate(selectedMovement.createdAt)}</strong>
              </div>

              <div>
                <span>Movement ID</span>
                <strong>{selectedMovement.id}</strong>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default StockMovements;