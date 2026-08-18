import { Building2 } from 'lucide-react';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md">
                <Building2 className="size-5" />
            </div>
            <div className="ml-2 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-bold text-slate-900 dark:text-white">
                    CozQta
                </span>
                <span className="truncate text-xs text-indigo-600 font-medium">Solusi Kost Modern</span>
            </div>
        </>
    );
}
