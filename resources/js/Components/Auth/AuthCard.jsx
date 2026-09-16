/**
 * Card wrapper bergaya .brutal-card untuk membungkus form di halaman Auth.
 * Menampilkan flash message global (success/error) yang dibagikan
 * oleh HandleInertiaRequests.
 */
export default function AuthCard({ children, className = '' }) {
    return (
        <div className={`brutal-card p-6 sm:p-8 ${className}`}>
            {children}
        </div>
    );
}
