import { Link } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import Badge from "@/components/ui/Badge";
import Select from "@/components/ui/Select";
import TextArea from "@/components/ui/TextArea";
import TextField from "@/components/ui/TextField";
import { contactContent } from "@/data/contact";
import { legalEntity } from "@/data/legal";
import { useAuth } from "@/hooks/useAuth";

export default function Contact() {
  const content = contactContent;
  const { user } = useAuth();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    values: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      topic: content.topics[0].id,
      message: "",
    },
  });

  // No inbox endpoint exists, so the form composes the mail rather than
  // pretending to deliver it.
  const compose = ({ name, email, topic, message }) => {
    const label = content.topics.find(({ id }) => id === topic)?.label ?? topic;
    const body = `${message}\n\n—\n${name}\n${email}`;

    const subject = encodeURIComponent(`[${label}] message from ${name}`);
    window.location.assign(
      `mailto:${legalEntity.supportEmail}?subject=${subject}&body=${encodeURIComponent(body)}`,
    );
  };

  const channels = [
    {
      key: "email",
      value: legalEntity.supportEmail,
      href: `mailto:${legalEntity.supportEmail}`,
    },
    {
      key: "phone",
      value: legalEntity.phone,
      href: `tel:${legalEntity.phone}`,
    },
    {
      key: "whatsapp",
      value: legalEntity.whatsapp,
      href: `https://wa.me/${String(legalEntity.whatsapp).replace(/\D/g, "")}`,
    },
    { key: "address", value: legalEntity.address },
    { key: "hours", value: legalEntity.hours },
  ].filter(({ value }) => Boolean(value));

  return (
    <>
      <section className="sb-gradient-hero sb-section">
        <div className="sb-measure">
          <Badge className="mb-4">
            <i className="bi bi-envelope" /> {content.badge}
          </Badge>

          <h1 className="sb-display mb-3">{content.title}</h1>
          <p className="sb-lead mb-0">{content.lead}</p>
        </div>
      </section>

      <section className="sb-section">
        <div className="row g-4">
          <div className="col-lg-7">
            <section className="sb-card sb-panel sb-card-overflow">
              <div className="sb-panel-head">
                <h2 className="sb-h3 mb-0">{content.formTitle}</h2>
              </div>

              <form
                className="sb-panel-body sb-form-grid"
                onSubmit={handleSubmit(compose)}
                noValidate
              >
                <p className="sb-meta mb-0">{content.formLead}</p>

                <div className="row g-3">
                  <div className="col-12 col-sm-6">
                    <TextField
                      id="contact-name"
                      label={content.fields.name}
                      placeholder={content.placeholders.name}
                      error={errors.name?.message}
                      {...register("name", {
                        required: "Tell us who you are",
                      })}
                    />
                  </div>
                  <div className="col-12 col-sm-6">
                    <TextField
                      id="contact-email"
                      type="email"
                      label={content.fields.email}
                      placeholder={content.placeholders.email}
                      error={errors.email?.message}
                      {...register("email", {
                        required: "We need somewhere to reply",
                      })}
                    />
                  </div>
                </div>

                <div>
                  <span className="sb-field-label">{content.fields.topic}</span>
                  <Controller
                    name="topic"
                    control={control}
                    render={({ field }) => (
                      <Select
                        className="sb-select-field"
                        value={field.value}
                        options={content.topics}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <TextArea
                  id="contact-message"
                  rows={6}
                  label={content.fields.message}
                  placeholder={content.placeholders.message}
                  error={errors.message?.message}
                  {...register("message", {
                    required: "Let us know what happened",
                    minLength: {
                      value: 10,
                      message: "A little more detail helps us help you",
                    },
                  })}
                />

                <div>
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-4"
                  >
                    <i className="bi bi-box-arrow-up-right" /> {content.submit}
                  </button>
                </div>
              </form>
            </section>
          </div>

          <div className="col-lg-5">
            <section className="sb-card sb-panel mb-4">
              <div className="sb-panel-head">
                <h2 className="sb-h3 mb-0">{content.channels.title}</h2>
              </div>

              <div className="sb-panel-body sb-spec-list">
                {channels.map(({ key, value, href }) => (
                  <div className="sb-contact-row" key={key}>
                    <span className="sb-about-icon">
                      <i className={`bi ${content.channels[key].icon}`} />
                    </span>
                    <div className="min-w-0">
                      <div className="sb-meta">
                        {content.channels[key].label}
                      </div>
                      {href ? (
                        <a href={href} className="fw-semibold">
                          {value}
                        </a>
                      ) : (
                        <div className="fw-semibold">{value}</div>
                      )}
                    </div>
                  </div>
                ))}

                <p className="sb-caption mb-0">
                  {content.replyNote.replace("{time}", legalEntity.replyWithin)}
                </p>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section className="sb-section sb-subtle">
        <div className="text-center mb-5">
          <h2 className="sb-h1 mb-0">{content.before.title}</h2>
        </div>

        <div className="row row-cols-1 row-cols-md-3 g-4">
          {content.before.items.map(({ icon, title, body, action }) => (
            <div className="col" key={title}>
              <article className="sb-card h-100 p-4 d-flex flex-column">
                <span className="sb-about-icon mb-3">
                  <i className={`bi ${icon}`} />
                </span>
                <h3 className="sb-h3 mb-2">{title}</h3>
                <p className="sb-lead">{body}</p>
                <Link
                  to={action.to}
                  className="sb-small fw-semibold mt-auto d-inline-flex align-items-center gap-2"
                >
                  {action.label} <i className="bi bi-arrow-right" />
                </Link>
              </article>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
