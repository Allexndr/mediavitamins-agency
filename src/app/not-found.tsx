import { Button } from "@/shared/ui/Button";
import { Container } from "@/shared/ui/Container";

export default function NotFound() {
  return (
    <Container className="min-h-[60vh] flex flex-col items-center justify-center text-center py-20">
      <p className="text-8xl font-display text-primary/20 mb-4">404</p>
      <h1 className="font-display text-3xl mb-4">Страница не найдена</h1>
      <p className="text-on-surface-variant mb-8 max-w-md">
        Возможно, товар снят с продажи или ссылка устарела. Перейдите в каталог или на главную.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button href="/catalog">В каталог</Button>
        <Button href="/" variant="outline">
          На главную
        </Button>
      </div>
    </Container>
  );
}
