import { Header } from '@/components/Header';

type MainLayoutProps = {
  children: React.ReactNode;
};
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div>
      <Header />
      <div className="container mb-16 mt-5">{children}</div>
    </div>
  );
}
