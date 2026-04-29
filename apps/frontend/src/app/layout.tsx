import './globals.css'; import { AdminShell } from '@/components/admin-shell';
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang='pt-BR'><body><AdminShell>{children}</AdminShell></body></html>}
