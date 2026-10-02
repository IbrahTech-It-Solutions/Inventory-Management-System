import {
  ArrowLeft,
  ImagePlus,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import type {
  Category,
  CategoryClassification,
} from "../../types/Category.types";
import type {
  BaseUnit,
  Product,
  ProductCategorySelection,
  ProductQuality,
} from "../../types/Product.types";
import {
  BASE_UNITS,
  PRODUCT_QUALITIES,
} from "../../constants/productConstants";
import { generateProductSku } from "../../utils/generateProductSku";
import Button from "../../components/ui/button/Button";
import Input from "../../components/ui/input/Input";
import Modal from "../../components/ui/modal/Modal";
import Select from "../../components/ui/select/Select";
import { useToast } from "../../components/ui/pop/useToast";
import styles from "./Products.module.css";

const categories: Category[] = [
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

const initialProducts: Product[] = [];

const Products = () => {
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>(initialProducts);

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [name, setName] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [sellingPrice, setSellingPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [quality, setQuality] = useState<ProductQuality>("new");
  const [description, setDescription] = useState("");
  const [baseUnit, setBaseUnit] = useState<BaseUnit>("piece");
  const [barcode, setBarcode] = useState("");

  const [categorySelection, setCategorySelection] =
    useState<ProductCategorySelection>({
      mainCategoryId: "",
      subcategoryId: "",
      typeId: "",
      brandId: "",
      modelId: "",
      variantId: "",
    });

  const categoryOptions = useMemo(() => {
    const createOptions = (classification: CategoryClassification) =>
      categories
        .filter((category) => category.classification === classification)
        .map((category) => ({
          value: category.id,
          label: `${category.name} (${category.sku})`,
        }));

    return {
      mainCategory: createOptions("main-category"),
      subcategory: createOptions("subcategory"),
      type: createOptions("type"),
      brand: createOptions("brand"),
      model: createOptions("model"),
      variant: createOptions("variant"),
    };
  }, []);

  const generatedSku = useMemo(
    () => generateProductSku(categories, categorySelection),
    [categorySelection],
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter((product) => {
      const searchableValues = [
        product.name,
        product.sku,
        product.barcode ?? "",
      ];

      return searchableValues.some((value) =>
        value.toLowerCase().includes(query),
      );
    });
  }, [products, search]);

  useEffect(() => {
    if (!selectedProduct) {
      return;
    }

    const currentProduct = products.find(
      (product) => product.id === selectedProduct.id,
    );

    if (!currentProduct) {
      setSelectedProduct(null);
      return;
    }

    setSelectedProduct(currentProduct);
  }, [products, selectedProduct]);

  useEffect(() => {
    if (!selectedProduct) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedProduct(null);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProduct]);

  const resetForm = () => {
    setEditingProduct(null);
    setName("");
    setImages([]);
    setSellingPrice("");
    setCostPrice("");
    setQuantity("");
    setQuality("new");
    setDescription("");
    setBaseUnit("piece");
    setBarcode("");

    setCategorySelection({
      mainCategoryId: "",
      subcategoryId: "",
      typeId: "",
      brandId: "",
      modelId: "",
      variantId: "",
    });
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);

    setName(product.name);
    setImages(product.images);
    setSellingPrice(String(product.sellingPrice));
    setCostPrice(String(product.costPrice));
    setQuantity(String(product.quantity));
    setQuality(product.quality);
    setDescription(product.description);
    setBaseUnit(product.baseUnit);
    setBarcode(product.barcode ?? "");

    setCategorySelection({
      mainCategoryId: product.mainCategoryId ?? "",
      subcategoryId: product.subcategoryId ?? "",
      typeId: product.typeId ?? "",
      brandId: product.brandId ?? "",
      modelId: product.modelId ?? "",
      variantId: product.variantId ?? "",
    });

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const openProductDetails = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeProductDetails = () => {
    setSelectedProduct(null);
  };

  const handleCategoryChange = (
    field: keyof ProductCategorySelection,
    value: string,
  ) => {
    setCategorySelection((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    const imageUrls = files.map((file) => URL.createObjectURL(file));

    setImages((current) => [...current, ...imageUrls]);

    event.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((current) =>
      current.filter((_, imageIndex) => imageIndex !== index),
    );
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) {
      return "—";
    }

    return (
      categories.find((category) => category.id === categoryId)?.name ?? "—"
    );
  };

  const getProductCategories = (product: Product) => {
    return [
      getCategoryName(product.mainCategoryId),
      getCategoryName(product.subcategoryId),
      getCategoryName(product.typeId),
      getCategoryName(product.brandId),
      getCategoryName(product.modelId),
      getCategoryName(product.variantId),
    ]
      .filter((category) => category !== "—")
      .join(", ");
  };

  const getProductCategoryItems = (product: Product) => {
    return [
      {
        label: "Main Category",
        value: getCategoryName(product.mainCategoryId),
      },
      {
        label: "Subcategory",
        value: getCategoryName(product.subcategoryId),
      },
      {
        label: "Type",
        value: getCategoryName(product.typeId),
      },
      {
        label: "Brand",
        value: getCategoryName(product.brandId),
      },
      {
        label: "Model",
        value: getCategoryName(product.modelId),
      },
      {
        label: "Variant",
        value: getCategoryName(product.variantId),
      },
    ];
  };

  const formatPrice = (value: number) =>
    value.toLocaleString("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formatDate = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat("en-GH", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  const handleSubmit = () => {
    const trimmedName = name.trim();
    const parsedSellingPrice = Number(sellingPrice);
    const parsedCostPrice = Number(costPrice);
    const parsedQuantity = Number(quantity);

    if (!trimmedName) {
      showToast({
        type: "error",
        title: "Product name required",
        message: "Please enter a product name before saving.",
      });
      return;
    }

    if (
      Number.isNaN(parsedSellingPrice) ||
      Number.isNaN(parsedCostPrice) ||
      Number.isNaN(parsedQuantity)
    ) {
      showToast({
        type: "error",
        title: "Invalid product values",
        message: "Please enter valid prices and quantity.",
      });
      return;
    }

    if (parsedSellingPrice < 0 || parsedCostPrice < 0 || parsedQuantity < 0) {
      showToast({
        type: "error",
        title: "Invalid product values",
        message: "Prices and quantity cannot be negative.",
      });
      return;
    }

    const duplicateSku = products.some(
      (product) =>
        product.id !== editingProduct?.id && product.sku === generatedSku,
    );

    if (duplicateSku) {
      showToast({
        type: "error",
        title: "Duplicate SKU",
        message: "A product with this category combination already exists.",
      });
      return;
    }

    const now = new Date().toISOString();

    if (editingProduct) {
      setProducts((current) =>
        current.map((product) =>
          product.id === editingProduct.id
            ? {
                ...product,
                name: trimmedName,
                images,
                sellingPrice: parsedSellingPrice,
                costPrice: parsedCostPrice,
                quantity: parsedQuantity,
                quality,
                description: description.trim(),
                baseUnit,
                barcode: barcode.trim() || null,
                mainCategoryId: categorySelection.mainCategoryId || null,
                subcategoryId: categorySelection.subcategoryId || null,
                typeId: categorySelection.typeId || null,
                brandId: categorySelection.brandId || null,
                modelId: categorySelection.modelId || null,
                variantId: categorySelection.variantId || null,
                sku: generatedSku,
                updatedAt: now,
              }
            : product,
        ),
      );

      closeModal();

      showToast({
        type: "success",
        title: "Product updated",
        message: "The product was updated successfully.",
      });

      return;
    }

    const newProduct: Product = {
      id: crypto.randomUUID(),
      name: trimmedName,
      images,
      sellingPrice: parsedSellingPrice,
      costPrice: parsedCostPrice,
      quantity: parsedQuantity,
      quality,
      description: description.trim(),
      baseUnit,
      barcode: barcode.trim() || null,
      mainCategoryId: categorySelection.mainCategoryId || null,
      subcategoryId: categorySelection.subcategoryId || null,
      typeId: categorySelection.typeId || null,
      brandId: categorySelection.brandId || null,
      modelId: categorySelection.modelId || null,
      variantId: categorySelection.variantId || null,
      sku: generatedSku,
      createdAt: now,
      updatedAt: now,
    };

    setProducts((current) => [newProduct, ...current]);

    closeModal();

    showToast({
      type: "success",
      title: "Product created",
      message: "The product was created successfully.",
    });
  };

  const handleDelete = (id: string) => {
    const product = products.find((item) => item.id === id);

    if (!product) {
      return;
    }

    setProducts((current) => current.filter((item) => item.id !== id));

    setSelectedProduct(null);

    showToast({
      type: "success",
      title: "Product deleted",
      message: `${product.name} was deleted successfully.`,
    });
  };

  const handleDetailsEdit = (product: Product) => {
    setSelectedProduct(null);
    openEditModal(product);
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>Products</h1>

          <p>
            Manage products, pricing, stock, classifications, and product
            information.
          </p>
        </div>

        <Button type="button" onClick={openCreateModal}>
          <Plus size={18} aria-hidden="true" />
          Add Product
        </Button>
      </header>

      <section className={styles.toolbar}>
        <div className={styles.search}>
          <Search className={styles.searchIcon} size={18} aria-hidden="true" />
          <Input
            label="Search"
            value={search}
            onChange={(value) => setSearch(value)}
            placeholder="Search products..."
            aria-label="Search products"
          />
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2>Product List</h2>

            <span>{filteredProducts.length} products</span>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className={styles.empty}>
            <h3>No products found</h3>

            <p>Try changing your search or create a new product.</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Categories</th>
                  <th>Cost Price</th>
                  <th>Selling Price</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                  <th>Quality</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className={styles.productRow}
                    onDoubleClick={() => openProductDetails(product)}
                  >
                    <td>
                      <button
                        type="button"
                        className={styles.productCellButton}
                        onClick={() => openProductDetails(product)}
                        aria-label={`View ${product.name} details`}
                      >
                        <div className={styles.productCell}>
                          {product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt=""
                              className={styles.thumbnail}
                            />
                          ) : (
                            <div
                              className={styles.imagePlaceholder}
                              aria-hidden="true"
                            >
                              <ImagePlus size={18} />
                            </div>
                          )}

                          <span className={styles.name}>{product.name}</span>
                        </div>
                      </button>
                    </td>

                    <td>
                      <span className={styles.sku}>{product.sku}</span>
                    </td>

                    <td>
                      <span className={styles.categories}>
                        {getProductCategories(product)}
                      </span>
                    </td>

                    <td>{formatPrice(product.costPrice)}</td>

                    <td>{formatPrice(product.sellingPrice)}</td>

                    <td>{product.quantity}</td>

                    <td>{product.baseUnit}</td>

                    <td>
                      <span className={styles.badge}>{product.quality}</span>
                    </td>

                    <td>
                      <div className={styles.actions}>
                        <Button
                          type="button"
                          variant="icon"
                          aria-label={`Edit ${product.name}`}
                          onClick={() => openEditModal(product)}
                        >
                          <Pencil size={17} aria-hidden="true" />
                        </Button>

                        <Button
                          type="button"
                          variant="icon"
                          aria-label={`Delete ${product.name}`}
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 size={17} aria-hidden="true" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        title={editingProduct ? "Edit Product" : "Create Product"}
        description="Add the product details, classification, pricing, stock, and images."
        footer={
          <>
            <Button type="button" variant="border" onClick={closeModal}>
              Cancel
            </Button>

            <Button type="button" onClick={handleSubmit}>
              {editingProduct ? "Save Changes" : "Create Product"}
            </Button>
          </>
        }
      >
        <div className={styles.form}>
          <Input
            label="Product Name"
            value={name}
            onChange={(value) => setName(value)}
            placeholder="Enter product name"
            required
          />

          <div className={styles.field}>
            <label htmlFor="product-images">Product Images</label>

            <input
              id="product-images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />

            {images.length > 0 && (
              <div className={styles.imageGrid}>
                {images.map((image, index) => (
                  <div className={styles.imageItem} key={`${image}-${index}`}>
                    <img src={image} alt={`Product ${index + 1}`} />

                    <button
                      type="button"
                      className={styles.removeImage}
                      aria-label={`Remove image ${index + 1}`}
                      onClick={() => removeImage(index)}
                    >
                      <X size={15} aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.gridTwo}>
            <Input
              label="Cost Price"
              type="number"
              min="0"
              step="0.01"
              value={costPrice}
              onChange={(value) => setCostPrice(value)}
              placeholder="0.00"
              required
            />

            <Input
              label="Selling Price"
              type="number"
              min="0"
              step="0.01"
              value={sellingPrice}
              onChange={(value) => setSellingPrice(value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className={styles.gridTwo}>
            <Input
              label="Quantity"
              type="number"
              min="0"
              step="1"
              value={quantity}
              onChange={(value) => setQuantity(value)}
              placeholder="0"
              required
            />

            <Select
              label="Base Unit"
              value={baseUnit}
              onChange={(value) => setBaseUnit(value as BaseUnit)}
              options={BASE_UNITS}
              required
            />
          </div>

          <Select
            label="Quality"
            value={quality}
            onChange={(value) => setQuality(value as ProductQuality)}
            options={PRODUCT_QUALITIES}
            required
          />

          <div className={styles.categorySection}>
            <div className={styles.sectionHeader}>
              <div>
                <h3>Product Classification</h3>

                <p>
                  Select the category item for each classification. Unselected
                  classifications use 000 in the SKU.
                </p>
              </div>
            </div>

            <div className={styles.categoryGrid}>
              <Select
                label="Main Category"
                value={categorySelection.mainCategoryId}
                onChange={(value) =>
                  handleCategoryChange("mainCategoryId", value)
                }
                options={categoryOptions.mainCategory}
                placeholder="Select main category"
              />

              <Select
                label="Subcategory"
                value={categorySelection.subcategoryId}
                onChange={(value) =>
                  handleCategoryChange("subcategoryId", value)
                }
                options={categoryOptions.subcategory}
                placeholder="Select subcategory"
              />

              <Select
                label="Type"
                value={categorySelection.typeId}
                onChange={(value) => handleCategoryChange("typeId", value)}
                options={categoryOptions.type}
                placeholder="Select type"
              />

              <Select
                label="Brand"
                value={categorySelection.brandId}
                onChange={(value) => handleCategoryChange("brandId", value)}
                options={categoryOptions.brand}
                placeholder="Select brand"
              />

              <Select
                label="Model"
                value={categorySelection.modelId}
                onChange={(value) => handleCategoryChange("modelId", value)}
                options={categoryOptions.model}
                placeholder="Select model"
              />

              <Select
                label="Variant"
                value={categorySelection.variantId}
                onChange={(value) => handleCategoryChange("variantId", value)}
                options={categoryOptions.variant}
                placeholder="Select variant"
              />
            </div>

            <div className={styles.skuPreview}>
              <span className={styles.skuLabel}>Product SKU</span>

              <code>{generatedSku}</code>
            </div>
          </div>

          <Input
            label="Barcode"
            value={barcode}
            onChange={(value) => setBarcode(value)}
            placeholder="Optional"
          />

          <Input
            label="Description"
            value={description}
            onChange={(value) => setDescription(value)}
            placeholder="Describe the product..."
            multiline
          />
        </div>
      </Modal>

      {selectedProduct && (
        <div
          className={styles.detailsOverlay}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeProductDetails();
            }
          }}
        >
          <aside
            className={styles.detailsPanel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-details-title"
          >
            <header className={styles.detailsHeader}>
              <button
                type="button"
                className={styles.backButton}
                onClick={closeProductDetails}
              >
                <ArrowLeft size={18} aria-hidden="true" />
                Back
              </button>

              <button
                type="button"
                className={styles.detailsClose}
                onClick={closeProductDetails}
                aria-label="Close product details"
              >
                <X size={19} aria-hidden="true" />
              </button>
            </header>

            <div className={styles.detailsContent}>
              <div className={styles.detailsProductHeader}>
                <div className={styles.detailsMainImage}>
                  {selectedProduct.images[0] ? (
                    <img
                      src={selectedProduct.images[0]}
                      alt={selectedProduct.name}
                    />
                  ) : (
                    <ImagePlus size={42} aria-hidden="true" />
                  )}
                </div>

                <div className={styles.detailsHeading}>
                  <span className={styles.detailsEyebrow}>Product Details</span>

                  <h2 id="product-details-title">{selectedProduct.name}</h2>

                  <code className={styles.detailsSku}>
                    {selectedProduct.sku}
                  </code>

                  <span className={styles.detailsQuality}>
                    {selectedProduct.quality}
                  </span>
                </div>
              </div>

              {selectedProduct.images.length > 1 && (
                <div className={styles.detailsGallery}>
                  {selectedProduct.images.map((image, index) => (
                    <img
                      key={`${image}-${index}`}
                      src={image}
                      alt={`${selectedProduct.name} ${index + 1}`}
                    />
                  ))}
                </div>
              )}

              <div className={styles.detailsActions}>
                <Button
                  type="button"
                  onClick={() => handleDetailsEdit(selectedProduct)}
                >
                  <Pencil size={16} aria-hidden="true" />
                  Edit Product
                </Button>

                <Button
                  type="button"
                  variant="border"
                  onClick={() => handleDelete(selectedProduct.id)}
                >
                  <Trash2 size={16} aria-hidden="true" />
                  Delete
                </Button>
              </div>

              <section className={styles.detailsSection}>
                <div className={styles.detailsSectionHeader}>
                  <h3>Pricing & Stock</h3>
                </div>

                <div className={styles.detailsInfoGrid}>
                  <div className={styles.detailItem}>
                    <span>Cost Price</span>
                    <strong>{formatPrice(selectedProduct.costPrice)}</strong>
                  </div>

                  <div className={styles.detailItem}>
                    <span>Selling Price</span>
                    <strong>{formatPrice(selectedProduct.sellingPrice)}</strong>
                  </div>

                  <div className={styles.detailItem}>
                    <span>Quantity</span>
                    <strong>{selectedProduct.quantity}</strong>
                  </div>

                  <div className={styles.detailItem}>
                    <span>Base Unit</span>
                    <strong>{selectedProduct.baseUnit}</strong>
                  </div>
                </div>
              </section>

              <section className={styles.detailsSection}>
                <div className={styles.detailsSectionHeader}>
                  <h3>Classification</h3>
                </div>

                <div className={styles.classificationList}>
                  {getProductCategoryItems(selectedProduct).map((item) => (
                    <div key={item.label} className={styles.classificationItem}>
                      <span>{item.label}</span>

                      <strong>{item.value}</strong>
                    </div>
                  ))}
                </div>
              </section>

              <section className={styles.detailsSection}>
                <div className={styles.detailsSectionHeader}>
                  <h3>Product Information</h3>
                </div>

                <div className={styles.classificationList}>
                  <div className={styles.classificationItem}>
                    <span>Barcode</span>

                    <strong>{selectedProduct.barcode ?? "Not provided"}</strong>
                  </div>

                  <div className={styles.classificationItem}>
                    <span>Product ID</span>

                    <strong>{selectedProduct.id}</strong>
                  </div>

                  <div className={styles.classificationItem}>
                    <span>Created</span>

                    <strong>{formatDate(selectedProduct.createdAt)}</strong>
                  </div>

                  <div className={styles.classificationItem}>
                    <span>Last Updated</span>

                    <strong>{formatDate(selectedProduct.updatedAt)}</strong>
                  </div>
                </div>
              </section>

              <section className={styles.detailsSection}>
                <div className={styles.detailsSectionHeader}>
                  <h3>Description</h3>
                </div>

                <p className={styles.descriptionText}>
                  {selectedProduct.description || "No description provided."}
                </p>
              </section>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
};

export default Products;
