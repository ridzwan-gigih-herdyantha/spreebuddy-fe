import { Link, useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Select from "@/components/ui/Select";
import TextArea from "@/components/ui/TextArea";
import TextField from "@/components/ui/TextField";
import {
  createProduct,
  getProduct,
  listCategories,
  updateProduct,
} from "@/api/products";
import { adminRoutes } from "@/config/admin";
import { productFormContent, productTypes } from "@/data/admin";

const num = (value) =>
  value === "" || value === null || value === undefined
    ? undefined
    : Number(value);

const required = (label) => ({ required: `${label} is required` });

const positive = (label) => ({
  ...required(label),
  min: { value: 0, message: `${label} must be 0 or more` },
});

const blank = {
  name: "",
  description: "",
  category: "",
  type: "physical",
  regularPrice: "",
  salePrice: "",
  stock: "",
  weight: "",
  dimensions: { length: "", width: "", height: "" },
};

const toForm = (product) => ({
  name: product.name ?? "",
  description: product.description ?? "",
  category: product.category ?? "",
  type: product.type ?? "physical",
  regularPrice: product.regularPrice ?? "",
  salePrice: product.salePrice ?? "",
  stock: product.stock ?? "",
  weight: product.weight ?? "",
  dimensions: {
    length: product.dimensions?.length ?? "",
    width: product.dimensions?.width ?? "",
    height: product.dimensions?.height ?? "",
  },
});

export default function AdminProductForm() {
  const { slug } = useParams();
  const editing = Boolean(slug);
  const content = productFormContent;
  const mode = editing ? content.edit : content.create;

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const product = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProduct(slug),
    enabled: editing,
    retry: false,
  });

  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: listCategories,
    staleTime: 5 * 60 * 1000,
  });

  const {
    register,
    control,
    getValues,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    values: product.data?.data ? toForm(product.data.data) : blank,
  });

  const save = useMutation({
    mutationFn: (body) =>
      editing
        ? updateProduct({ id: product.data.data.id, ...body })
        : createProduct(body),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      // Editing regenerates the slug, so route off the response, not the param.
      const saved = response?.data;
      navigate(`${adminRoutes.products}/${saved?.slug ?? ""}`, {
        replace: true,
      });
    },

    onError: (err) => {
      err.fieldErrors?.forEach(({ field, message }) => {
        if (field) setError(field, { message });
      });
    },
  });

  const categoryOptions = (categories.data?.data ?? []).map(({ name }) => ({
    id: name,
    label: name,
  }));

  const onSubmit = (values) => {
    const sides = ["length", "width", "height"].map((side) =>
      num(values.dimensions?.[side]),
    );
    const filled = sides.filter((side) => side !== undefined);

    if (filled.length > 0 && filled.length < 3) {
      setError("dimensions.length", { message: content.errors.dimensions });
      return;
    }

    const dimensions =
      filled.length === 3
        ? { length: sides[0], width: sides[1], height: sides[2] }
        : null;

    const sale = num(values.salePrice);

    save.mutate({
      name: values.name.trim(),
      description: values.description.trim(),
      category: values.category,
      type: values.type,
      regularPrice: num(values.regularPrice),
      weight: num(values.weight),
      stock: num(values.stock),
      // PATCH takes null to clear these; POST rejects it, so they are omitted.
      ...(sale === undefined
        ? editing
          ? { salePrice: null }
          : {}
        : { salePrice: sale }),
      ...(dimensions === null
        ? editing
          ? { dimensions: null }
          : {}
        : { dimensions }),
    });
  };

  const formError =
    save.error && !save.error.fieldErrors?.length ? save.error.message : null;

  if (editing && product.isError) {
    return (
      <div className="sb-admin-soon">
        <h1 className="sb-h1 mb-2">Product not found</h1>
        <p className="sb-lead mb-4">{product.error.message}</p>
        <Link to={content.back.to} className="sb-pill sb-pill-outline">
          <i className="bi bi-arrow-left" /> {content.back.label}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <header className="sb-admin-head">
        <div>
          <Link to={content.back.to} className="sb-admin-back">
            <i className="bi bi-arrow-left" /> {content.back.label}
          </Link>
          <h1 className="sb-h1 mt-2 mb-1">{mode.title}</h1>
          <p className="sb-lead mb-0">{mode.lead}</p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <Link to={content.back.to} className="sb-pill sb-pill-outline">
            {content.cancel}
          </Link>
          <button
            type="submit"
            className="btn btn-primary rounded-pill px-4 text-nowrap"
            disabled={save.isPending || (editing && product.isPending)}
          >
            {save.isPending ? mode.pending : mode.submit}
          </button>
        </div>
      </header>

      {formError && (
        <p className="sb-form-error" role="alert">
          <i className="bi bi-exclamation-triangle-fill" /> {formError}
        </p>
      )}

      <div className="row g-3">
        <div className="col-12 col-xl-8">
          <section className="sb-card sb-panel sb-card-overflow">
            <div className="sb-panel-head">
              <h2 className="sb-h3 mb-0">{content.sections.details}</h2>
            </div>

            <div className="sb-panel-body sb-form-grid">
              <TextField
                id="name"
                label={content.fields.name}
                placeholder="Aurora NC 700"
                error={errors.name?.message}
                {...register("name", required(content.fields.name))}
              />

              <TextArea
                id="description"
                rows={6}
                label={content.fields.description}
                placeholder="What is it, and who is it for?"
                error={errors.description?.message}
                {...register(
                  "description",
                  required(content.fields.description),
                )}
              />

              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <span className="sb-field-label">
                    {content.fields.category}
                  </span>
                  <Controller
                    name="category"
                    control={control}
                    rules={required(content.fields.category)}
                    render={({ field }) => (
                      <Select
                        className="sb-select-field"
                        value={field.value}
                        options={categoryOptions}
                        placeholder={
                          categories.isPending ? "Loading…" : "Choose one"
                        }
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.category && (
                    <p className="sb-field-error">{errors.category.message}</p>
                  )}
                </div>

                <div className="col-12 col-sm-6">
                  <span className="sb-field-label">{content.fields.type}</span>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <Select
                        className="sb-select-field"
                        value={field.value}
                        options={productTypes}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="col-12 col-xl-4">
          <div className="d-flex flex-column gap-3">
            <section className="sb-card sb-panel">
              <div className="sb-panel-head">
                <h2 className="sb-h3 mb-0">{content.sections.pricing}</h2>
              </div>

              <div className="sb-panel-body sb-form-grid">
                <TextField
                  id="regularPrice"
                  type="number"
                  min="0"
                  step="1"
                  label={content.fields.regularPrice}
                  placeholder="0"
                  error={errors.regularPrice?.message}
                  {...register(
                    "regularPrice",
                    positive(content.fields.regularPrice),
                  )}
                />

                <TextField
                  id="salePrice"
                  type="number"
                  min="0"
                  step="1"
                  label={content.fields.salePrice}
                  placeholder="—"
                  help={content.help.salePrice}
                  error={errors.salePrice?.message}
                  {...register("salePrice", {
                    min: {
                      value: 0,
                      message: `${content.fields.salePrice} must be 0 or more`,
                    },
                    // PATCH does not enforce this server side, so it is caught here.
                    validate: (value) =>
                      value === "" ||
                      Number(value) <= Number(getValues("regularPrice")) ||
                      content.errors.salePrice,
                  })}
                />
              </div>
            </section>

            <section className="sb-card sb-panel">
              <div className="sb-panel-head">
                <h2 className="sb-h3 mb-0">{content.sections.inventory}</h2>
              </div>

              <div className="sb-panel-body sb-form-grid">
                <TextField
                  id="stock"
                  type="number"
                  min="0"
                  step="1"
                  label={content.fields.stock}
                  placeholder="0"
                  error={errors.stock?.message}
                  {...register("stock", positive(content.fields.stock))}
                />

                <TextField
                  id="weight"
                  type="number"
                  min="0"
                  step="0.01"
                  label={content.fields.weight}
                  placeholder="0"
                  help={content.help.weight}
                  error={errors.weight?.message}
                  {...register("weight", positive(content.fields.weight))}
                />

                <div>
                  <span className="sb-field-label">
                    {content.sections.dimensions}
                  </span>
                  <div className="row g-2">
                    {["length", "width", "height"].map((side) => (
                      <div className="col-4" key={side}>
                        <TextField
                          id={side}
                          type="number"
                          min="0"
                          step="0.1"
                          label={content.fields[side]}
                          placeholder="0"
                          className="sb-dimension-field"
                          {...register(`dimensions.${side}`)}
                        />
                      </div>
                    ))}
                  </div>
                  <p
                    className={
                      errors.dimensions?.length
                        ? "sb-field-error"
                        : "sb-field-help"
                    }
                  >
                    {errors.dimensions?.length?.message ??
                      content.help.dimensions}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </form>
  );
}
