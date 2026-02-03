
from PIL import Image
import numpy as np

def remove_black_background(input_path, output_path, threshold=50):
    img = Image.open(input_path).convert("RGBA")
    data = np.array(img)
    
    # Calculate brightness (r+g+b)
    r, g, b, a = data.T
    brightness = (r.astype(int) + g.astype(int) + b.astype(int)) / 3
    
    # Create mask: pixels darker than threshold are transparent
    mask = brightness < threshold
    
    # Set alpha to 0 for dark pixels
    data[..., 3][mask.T] = 0
    
    # Save
    new_img = Image.fromarray(data)
    new_img.save(output_path)
    print(f"Saved transparent image to {output_path}")

input_file = "/Users/leh/.gemini/antigravity/brain/8cd24ce3-a92e-463b-b0bd-e7260694ce03/frog_pixel_black_bg_1769554535284.png"
output_file = "/Users/leh/app-affi/frog-go/public/frog-transparent-final.png"

remove_black_background(input_file, output_file)
