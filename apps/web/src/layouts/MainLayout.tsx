import { Header } from '@/components/Header';

type MainLayoutProps = {
  children: React.ReactNode;
};
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
