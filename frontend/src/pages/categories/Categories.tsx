import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type {
  Category,
  CategoryClassification,
} from "../../types/Category.types";
import { CATEGORY_CLASSIFICATIONS } from "../../constants/categoryConstants";
import { generateCategorySku } from "../../utils/generateCategorySku";
import Button from "../../components/ui/button/Button";
import Input from "../../components/ui/input/Input";
import Modal from "../../components/ui/modal/Modal";
import Select from "../../components/ui/select/Select";
import { useToast } from "../../components/ui/pop/useToast";
import styles from "./Categories.module.css";

const initialCategories: Category[] = [
  {
    id: "1",
    name: "Electronics",
    sku: "ELE",
    classification: "main-category",
    parentCategoryId: null,
    createdAt: "2026-10-01",
    updatedAt: "2026-10-01",
  },
  {
    id: "2",
    name: "Smartphones",
    sku: "SMA",
    classification: "subcategory",
    parentCategoryId: "1",
    createdAt: "2026-10-01",
    updatedAt: "2026-10-01",
  },
  {
    id: "3",
    name: "Smartphone",
    sku: "SMT",
    classification: "type",
    parentCategoryId: "2",
    createdAt: "2026-10-01",
    updatedAt: "2026-10-01",
  },
  {
    id: "4",
    name: "Samsung",
    sku: "SAM",
    classification: "brand",
    parentCategoryId: "2",
    createdAt: "2026-10-01",
    updatedAt: "2026-10-01",
  },
  {
    id: "5",
    name: "Apple",
    sku: "APP",
    classification: "brand",
    parentCategoryId: "2",
    createdAt: "2026-10-01",
    updatedAt: "2026-10-01",
  },
  {
    id: "6",
    name: "Galaxy S24",
    sku: "GY4",
    classification: "model",
    parentCategoryId: "4",
    createdAt: "2026-10-01",
    updatedAt: "2026-10-01",
  },
];

const classificationOptions = [
  {
    value: "all",
    label: "All Classifications",
  },
  ...CATEGORY_CLASSIFICATIONS,
];

const parentClassifications: CategoryClassification[] = [
  "main-category",
  "subcategory",
  "type",
  "brand",
  "model",
];

const Categories = () => {
  const { showToast } = useToast();

  const [categories, setCategories] =
    useState<Category[]>(initialCategories);

  const [search, setSearch] = useState("");

  const [classificationFilter, setClassificationFilter] =
    useState<CategoryClassification | "all">("all");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  const [name, setName] = useState("");

  const [classification, setClassification] =
    useState<CategoryClassification>("main-category");

  const [parentCategoryId, setParentCategoryId] =
    useState("");

  const generatedSku = generateCategorySku(name);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    return categories.filter((category) => {
      const matchesSearch =
        !query ||
        category.name.toLowerCase().includes(query) ||
        category.sku.toLowerCase().includes(query);

      const matchesClassification =
        classificationFilter === "all" ||
        category.classification === classificationFilter;

      return matchesSearch && matchesClassification;
    });
  }, [categories, search, classificationFilter]);

  const parentCategoryOptions = useMemo(() => {
    return categories
      .filter((category) => {
        if (
          category.id === editingCategory?.id
        ) {
          return false;
        }

        return parentClassifications.includes(
          category.classification,
        );
      })
      .map((category) => ({
        value: category.id,
        label: `${category.name} (${category.sku})`,
      }));
  }, [categories, editingCategory]);

  const requiresParentCategory =
    classification !== "main-category";

  const getClassificationLabel = (
    value: CategoryClassification,
  ) =>
    CATEGORY_CLASSIFICATIONS.find(
      (item) => item.value === value,
    )?.label ?? value;

  const resetForm = () => {
    setEditingCategory(null);
    setName("");
    setClassification("main-category");
    setParentCategoryId("");
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setClassification(category.classification);
    setParentCategoryId(
      category.parentCategoryId ?? "",
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleClassificationChange = (
    value: string,
  ) => {
    const nextClassification =
      value as CategoryClassification;

    setClassification(nextClassification);

    if (nextClassification === "main-category") {
      setParentCategoryId("");
    }
  };

  const handleSubmit = () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      showToast({
        type: "error",
        title: "Category name required",
        message:
          "Please enter a category name.",
      });
      return;
    }

    if (generatedSku.length !== 3) {
      showToast({
        type: "error",
        title: "Invalid category SKU",
        message:
          "The category name must generate a three-character SKU.",
      });
      return;
    }

    if (
      requiresParentCategory &&
      !parentCategoryId
    ) {
      showToast({
        type: "error",
        title: "Parent category required",
        message:
          "Please select a parent category.",
      });
      return;
    }

    const parentCategory =
      categories.find(
        (category) =>
          category.id === parentCategoryId,
      ) ?? null;

    if (
      parentCategory &&
      parentCategory.classification ===
        classification
    ) {
      showToast({
        type: "error",
        title: "Invalid parent category",
        message:
          "A category cannot use another category with the same classification as its parent.",
      });
      return;
    }

    const duplicate = categories.some(
      (category) =>
        category.id !== editingCategory?.id &&
        category.classification ===
          classification &&
        category.sku === generatedSku,
    );

    if (duplicate) {
      showToast({
        type: "error",
        title: "Duplicate category SKU",
        message:
          "Another category with this classification already uses this SKU.",
      });
      return;
    }

    const now = new Date().toISOString();

    const finalParentCategoryId =
      classification === "main-category"
        ? null
        : parentCategoryId;

    if (editingCategory) {
      setCategories((current) =>
        current.map((category) =>
          category.id === editingCategory.id
            ? {
                ...category,
                name: trimmedName,
                sku: generatedSku,
                classification,
                parentCategoryId:
                  finalParentCategoryId,
                updatedAt: now,
              }
            : category,
        ),
      );

      closeModal();

      showToast({
        type: "success",
        title: "Category updated",
        message:
          "The category was updated successfully.",
      });

      return;
    }

    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: trimmedName,
      sku: generatedSku,
      classification,
      parentCategoryId:
        finalParentCategoryId,
      createdAt: now,
      updatedAt: now,
    };

    setCategories((current) => [
      newCategory,
      ...current,
    ]);

    closeModal();

    showToast({
      type: "success",
      title: "Category created",
      message:
        "The category was created successfully.",
    });
  };

  const handleDelete = (id: string) => {
    const category = categories.find(
      (item) => item.id === id,
    );

    if (!category) {
      return;
    }

    const hasChildren = categories.some(
      (item) =>
        item.parentCategoryId === id,
    );

    if (hasChildren) {
      showToast({
        type: "error",
        title: "Category cannot be deleted",
        message:
          "This category has child categories. Remove or move them first.",
      });
      return;
    }

    setCategories((current) =>
      current.filter(
        (item) => item.id !== id,
      ),
    );

    showToast({
      type: "success",
      title: "Category deleted",
      message:
        "The category was deleted successfully.",
    });
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>Categories</h1>

          <p>
            Manage product classifications and
            category SKU prefixes.
          </p>
        </div>

        <Button
          type="button"
          variant="border"
          onClick={openCreateModal}
        >
          <Plus size={18} />
          Add Category
        </Button>
      </header>

      <section className={styles.toolbar}>
        <div className={styles.search}>
          <Input
            label="Search"
            value={search}
            onChange={(value) =>
              setSearch(value)
            }
            placeholder="Search categories..."
            aria-label="Search categories"
          />
        </div>

        <Select
          label="Classification"
          value={classificationFilter}
          onChange={(value) =>
            setClassificationFilter(
              value as
                | CategoryClassification
                | "all",
            )
          }
          options={classificationOptions}
        />
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2>Category List</h2>

            <span>
              {filteredCategories.length} categories
            </span>
          </div>
        </div>

        {filteredCategories.length === 0 ? (
          <div className={styles.empty}>
            <h3>No categories found</h3>

            <p>
              Try changing your search or
              classification filter.
            </p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Classification</th>
                  <th>Parent</th>
                  <th>Updated</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>

              <tbody>
                {filteredCategories.map(
                  (category) => {
                    const parentCategory =
                      categories.find(
                        (item) =>
                          item.id ===
                          category.parentCategoryId,
                      );

                    return (
                      <tr key={category.id}>
                        <td>
                          <span
                            className={
                              styles.name
                            }
                          >
                            {category.name}
                          </span>
                        </td>

                        <td>
                          <span
                            className={
                              styles.sku
                            }
                          >
                            {category.sku}
                          </span>
                        </td>

                        <td>
                          <span
                            className={
                              styles.badge
                            }
                          >
                            {getClassificationLabel(
                              category.classification,
                            )}
                          </span>
                        </td>

                        <td>
                          {parentCategory?.name ??
                            "—"}
                        </td>

                        <td>
                          {new Date(
                            category.updatedAt,
                          ).toLocaleDateString()}
                        </td>

                        <td>
                          <div
                            className={
                              styles.actions
                            }
                          >
                            <Button
                              type="button"
                              variant="icon"
                              aria-label={`Edit ${category.name}`}
                              onClick={() =>
                                openEditModal(
                                  category,
                                )
                              }
                            >
                              <Pencil size={17} />
                            </Button>

                            <Button
                              type="button"
                              variant="icon"
                              aria-label={`Delete ${category.name}`}
                              onClick={() =>
                                handleDelete(
                                  category.id,
                                )
                              }
                            >
                              <Trash2 size={17} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  },
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        title={
          editingCategory
            ? "Edit Category"
            : "Create Category"
        }
        description="Create a classification category and its three-character SKU."
        footer={
          <>
            <Button
              type="button"
              variant="border"
              onClick={closeModal}
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleSubmit}
            >
              {editingCategory
                ? "Save Changes"
                : "Create Category"}
            </Button>
          </>
        }
      >
        <div className={styles.form}>
          <Input
            label="Name"
            value={name}
            onChange={(value) =>
              setName(value)
            }
            placeholder="Enter category name"
            required
          />

          <Select
            label="Classification"
            value={classification}
            onChange={
              handleClassificationChange
            }
            options={CATEGORY_CLASSIFICATIONS}
            required
          />

          {requiresParentCategory && (
            <Select
              label="Parent Category"
              value={parentCategoryId}
              onChange={setParentCategoryId}
              options={parentCategoryOptions}
              placeholder="Select parent category"
              required
            />
          )}

          <div className={styles.skuPreview}>
            <div>
              <span>SKU Prefix</span>

              <strong>
                {generatedSku || "---"}
              </strong>
            </div>

            <p>
              The SKU prefix is automatically
              generated from the category name.
            </p>
          </div>
        </div>
      </Modal>
    </main>
  );
};

export default Categories;