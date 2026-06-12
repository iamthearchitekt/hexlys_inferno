from PIL import Image, ImageDraw

def make_seamless_horizontal(img_path, output_path, blend_ratio=0.15):
    img = Image.open(img_path).convert("RGBA")
    w, h = img.size
    
    blend_w = int(w * blend_ratio)
    
    # We will create a new image that is slightly smaller (w - blend_w)
    # where the left and right overlap by blend_w.
    new_w = w - blend_w
    seamless = Image.new("RGBA", (new_w, h))
    
    # The main part of the image (0 to new_w)
    main_part = img.crop((0, 0, new_w, h))
    seamless.paste(main_part, (0, 0))
    
    # The rightmost part of the original image (which overlaps)
    overlap_part = img.crop((new_w, 0, w, h))
    
    # We create a gradient mask for the overlap part
    # It will be solid on its right edge (which will touch x=0 when wrapped)
    # and transparent on its left edge.
    mask = Image.new("L", (blend_w, h))
    draw = ImageDraw.Draw(mask)
    for x in range(blend_w):
        # Alpha from 0 (left) to 255 (right)
        alpha = int((x / blend_w) * 255)
        draw.line([(x, 0), (x, h)], fill=alpha)
        
    # We paste the overlap_part over the LEFT side of `seamless` using the mask
    # Wait, if the overlap part is the right side of the original image,
    # it needs to blend into the left side of the new image!
    # So we paste it at x=0
    seamless.paste(overlap_part, (0, 0), mask)
    
    # Now `seamless` is an image of width `w - blend_w` that perfectly tiles horizontally!
    seamless.convert("RGB").save(output_path, quality=95)

if __name__ == "__main__":
    make_seamless_horizontal("../background2.jpg", "../background2.jpg", 0.15)
    print("Edge blending complete!")
