import Link from "next/link";
import { Icon } from "@/shared/ui/Icon";
import { SITE } from "@/shared/config/site";

export function Footer() {
  return (
    <footer className="py-16 md:py-20 px-5 md:px-16 max-w-7xl mx-auto border-t border-outline-variant/30">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-6">
          <Link href="/" className="font-display text-3xl text-primary tracking-tight">
            {SITE.name}
          </Link>
          <p className="text-on-surface-variant max-w-xs">
            Ваш надёжный проводник в мир корейского велнеса и долголетия.
          </p>
          <div className="flex gap-3">
            <a
              href={SITE.instagram}
              className="w-11 h-11 rounded-full border border-outline flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all"
            >
              <Icon name="public" className="text-sm" />
            </a>
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              className="w-11 h-11 rounded-full border border-outline flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all"
            >
              <Icon name="chat" className="text-sm" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-title text-xs font-semibold uppercase tracking-widest text-primary mb-6">
            Компания
          </h4>
          <ul className="space-y-3 text-on-surface-variant">
            <li><Link href="/about" className="hover:text-primary transition-colors">О нас</Link></li>
            <li><Link href="/blog" className="hover:text-primary transition-colors">Блог</Link></li>
            <li><Link href="/contacts" className="hover:text-primary transition-colors">Контакты</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-title text-xs font-semibold uppercase tracking-widest text-primary mb-6">
            Помощь
          </h4>
          <ul className="space-y-3 text-on-surface-variant">
            <li><Link href="/delivery" className="hover:text-primary transition-colors underline decoration-primary">Доставка</Link></li>
            <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
            <li><Link href="/privacy" className="hover:text-primary transition-colors">Политика конфиденциальности</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-title text-xs font-semibold uppercase tracking-widest text-primary mb-6">
            Рассылка
          </h4>
          <p className="text-on-surface-variant mb-4 text-sm">
            Получайте советы по здоровью и секретные акции первыми.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="E-mail"
              className="flex-1 px-4 py-3 rounded-l-xl border border-outline-variant bg-white focus:ring-2 focus:ring-primary/30 outline-none"
            />
            <button className="bg-primary text-white px-4 rounded-r-xl hover:bg-primary/90 transition-colors">
              <Icon name="send" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-on-surface-variant">
        <p>© {new Date().getFullYear()} {SITE.name}. {SITE.tagline}.</p>
        <span>Made with care for Kazakhstan</span>
      </div>
    </footer>
  );
}
