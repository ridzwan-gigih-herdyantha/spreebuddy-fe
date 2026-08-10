import Logo from "@/components/ui/Logo";

export default function AuthSplit({ children, aside }) {
  return (
    <div className="sb-auth">
      <div className="sb-auth-form">
        <div className="sb-auth-inner">
          <Logo />
          {children}
        </div>
      </div>

      <aside className="sb-auth-aside sb-gradient">
        <div className="sb-auth-aside-inner">{aside}</div>
      </aside>
    </div>
  );
}
