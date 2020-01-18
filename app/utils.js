export function formatCommas(number) {
	let parts = number.toString().split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	return parts.join('.');
}

export function formatTime(seconds) {
	let minutes = Math.floor(seconds / 60);
	let hours = Math.floor(minutes / 60);
	let days = Math.floor(hours / 24);

	if (days > 0) {
		return `${days}d ${hours % 24}h`;
	} else if (hours > 0) {
		return `${hours}h ${minutes % 60}m`;
	} else if (minutes > 0) {
		return `${minutes}m`;
	}
}

export function formatPercent(number) {
	return `${number}%`;
}
