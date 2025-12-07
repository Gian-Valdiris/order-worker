/**
 * Formatea un número a formato de moneda colombiana
 * Ejemplo: 24000 => "24.000"
 * Ejemplo: 1500.50 => "1.500,50"
 */
export const formatCOP = (amount: number): string => {
	return new Intl.NumberFormat('es-CO', {
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	}).format(amount);
};

/**
 * Formatea un número a formato de moneda colombiana con símbolo
 * Ejemplo: 24000 => "$24.000 COP"
 */
export const formatCOPWithSymbol = (amount: number): string => {
	return `$${formatCOP(amount)} COP`;
};
