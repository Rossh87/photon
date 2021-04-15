export const resizeCanvasToTargetWidth = (canvas: HTMLCanvasElement) => (
	targetWidth: number
) => {
	while (canvas.width >= 2 * targetWidth) {
		canvas = scaleCanvas(canvas, 0.5);
	}

	if (canvas.width > targetWidth) {
		canvas = scaleCanvas(canvas, targetWidth / canvas.width);
	}

	return canvas;
};

const scaleCanvas = (canvas: HTMLCanvasElement, scale: number) => {
	const scaledCanvas = document.createElement('canvas');
	scaledCanvas.width = canvas.width * scale;
	scaledCanvas.height = canvas.height * scale;

	// it's impossible for getContext to return null here, so we cast
	// that possibility away
	const ctx = scaledCanvas.getContext('2d') as CanvasRenderingContext2D;
	ctx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);

	return scaledCanvas;
};
