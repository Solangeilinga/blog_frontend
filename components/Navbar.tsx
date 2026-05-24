"use client";
import Link from "next/link";
import { Menu, X, PenLine, LogOut, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import ThemeController  from "./ThemeController";
import LoginModal       from "./LoginModal";
import RegisterModal    from "./RegisterModal";
import { useAuth }      from "./AuthContext";
import { useRouter }    from "next/navigation";
import { Pacifico }     from "next/font/google";

const pacifico = Pacifico({ weight: "400", subsets: ["latin"] });

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();
  const router = useRouter();

  const isCreator = user?.role === "auteur" || user?.role === "admin";

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    router.push("/");
  };

  const openLogin = () => {
    setMenuOpen(false);
    (document.getElementById("login_modal") as HTMLDialogElement)?.showModal();
  };

  return (
    <>
      <div className="fixed top-0 w-full z-50 bg-blue-800 shadow-sm">
        <div className="navbar mx-auto px-4 max-w-7xl">

          {/* Logo */}
          <div className="flex-1">
            <Link href="/"
              className={`btn btn-ghost text-white hover:bg-white/10 text-2xl ${pacifico.className}`}>
              EduBlog
            </Link>
          </div>

          {/* ── Desktop ── */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/"
              className="btn btn-ghost btn-sm text-white/90 hover:text-white hover:bg-white/10">
              Articles
            </Link>
            {/* CORRIGÉ : /apropos → /a-propos */}
            <Link href="/a-propos"
              className="btn btn-ghost btn-sm text-white/90 hover:text-white hover:bg-white/10">
              À propos
            </Link>
            

            <div className="w-px h-5 bg-white/20 mx-1" />

            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-2 px-2">
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
                    {user?.username?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-white/90 text-sm font-medium max-w-[90px] truncate">
                    {user?.username}
                  </span>
                </div>

                {isCreator && (
                  <Link href="/dashboard"
                    className="btn btn-ghost btn-sm text-white/90 hover:text-white hover:bg-white/10 gap-1.5">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                )}

                {/* CORRIGÉ : /NewArticle → /nouvel-article */}
                {isCreator && (
                  <Link href="/nouvel-article"
                    className="btn btn-sm bg-white/15 hover:bg-white/25 text-white border-0 gap-1.5">
                    <PenLine className="h-4 w-4" />
                    Publier
                  </Link>
                )}

                <button onClick={handleLogout}
                  className="btn btn-ghost btn-sm text-rose-300 hover:text-white hover:bg-rose-500/30 gap-1.5">
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </button>
              </>
            ) : (
              <button onClick={openLogin}
                className="btn btn-sm bg-white/15 hover:bg-white/25 text-white border-0">
                Connexion
              </button>
            )}

            <ThemeController />
          </nav>

          {/* ── Mobile controls ── */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeController />
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="btn btn-ghost btn-sm text-white hover:bg-white/10">
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* ── Menu mobile ── */}
        {menuOpen && (
          <div className="md:hidden bg-blue-900 border-t border-blue-700/50 px-4 py-3 flex flex-col gap-1">

            <Link href="/" onClick={() => setMenuOpen(false)}
              className="btn btn-ghost btn-sm text-white justify-start hover:bg-white/10">
              Articles
            </Link>
            {/* CORRIGÉ : /apropos → /a-propos */}
            <Link href="/a-propos" onClick={() => setMenuOpen(false)}
              className="btn btn-ghost btn-sm text-white justify-start hover:bg-white/10">
              À propos
            </Link>
            {/* CORRIGÉ : /Contact → /contact */}
            <Link href="/contact" onClick={() => setMenuOpen(false)}
              className="btn btn-ghost btn-sm text-white justify-start hover:bg-white/10">
              Contact
            </Link>

            <div className="border-t border-white/10 my-1" />

            {isLoggedIn ? (
              <>
                <div className="px-3 py-2 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                    {user?.username?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{user?.username}</p>
                    <p className="text-xs text-white/50">{user?.role}</p>
                  </div>
                </div>

                {isCreator && (
                  <Link href="/dashboard" onClick={() => setMenuOpen(false)}
                    className="btn btn-ghost btn-sm text-white justify-start gap-2 hover:bg-white/10">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                )}
                {/* CORRIGÉ : /NewArticle → /nouvel-article */}
                {isCreator && (
                  <Link href="/nouvel-article" onClick={() => setMenuOpen(false)}
                    className="btn btn-ghost btn-sm text-white justify-start gap-2 hover:bg-white/10">
                    <PenLine className="h-4 w-4" /> Publier un article
                  </Link>
                )}

                <div className="border-t border-white/10 my-1" />

                <button onClick={handleLogout}
                  className="btn btn-ghost btn-sm text-rose-300 justify-start gap-2 hover:bg-white/10">
                  <LogOut className="h-4 w-4" /> Se déconnecter
                </button>
              </>
            ) : (
              <button onClick={openLogin}
                className="btn btn-ghost btn-sm text-white justify-start hover:bg-white/10">
                Connexion / Inscription
              </button>
            )}
          </div>
        )}
      </div>

      <LoginModal id="login_modal" registerModalId="register_modal" />
      <RegisterModal id="register_modal" loginModalId="login_modal" />
    </>
  );
};

export default Navbar;