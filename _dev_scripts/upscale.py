from PIL import Image

def upscale(file):
    try:
        img = Image.open(file)
        w, h = img.size
        # Upscale 2x using high-quality Lanczos resampling filter
        img = img.resize((w*2, h*2), Image.Resampling.LANCZOS)
        img.save(file)
        print(f"Upscaled {file} from {w}x{h} to {w*2}x{h*2}")
    except Exception as e:
        print(f"Failed to upscale {file}: {e}")

upscale('spawn_gate.png')
upscale('spawn_gate2.png')
