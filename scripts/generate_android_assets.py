from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
RES = ROOT / "android" / "app" / "src" / "main" / "res"

def font(size):
    for path in [Path("C:/Windows/Fonts/arialbd.ttf"), Path("C:/Windows/Fonts/msyhbd.ttc")]:
        if path.exists():
            return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()

def icon(size, transparent=False):
    image = Image.new("RGBA", (size, size), (7, 11, 24, 0 if transparent else 255))
    draw = ImageDraw.Draw(image)
    pad = int(size * .14)
    if not transparent:
        draw.rounded_rectangle((pad, pad, size-pad, size-pad), radius=int(size*.2), fill=(10,20,42,255), outline=(77,231,255,255), width=max(2,size//45))
    label="00"; face=font(int(size*.38)); box=draw.textbbox((0,0),label,font=face)
    x=(size-(box[2]-box[0]))/2; y=(size-(box[3]-box[1]))/2-box[1]
    draw.text((x,y),label,font=face,fill=(77,231,255,255),stroke_width=max(1,size//100),stroke_fill=(168,129,255,255))
    return image

densities={"mdpi":48,"hdpi":72,"xhdpi":96,"xxhdpi":144,"xxxhdpi":192}
for density,size in densities.items():
    folder=RES/f"mipmap-{density}";folder.mkdir(parents=True,exist_ok=True)
    icon(size).save(folder/"ic_launcher.png")
    icon(size).save(folder/"ic_launcher_round.png")
    icon(size,True).save(folder/"ic_launcher_foreground.png")

for folder in list(RES.glob("drawable-port-*"))+list(RES.glob("drawable-land-*")):
    size=(960,540) if "land" in folder.name else (540,960)
    image=Image.new("RGB",size,(5,7,19)); mark=min(size)//2; logo=icon(mark)
    image.paste(logo,((size[0]-mark)//2,(size[1]-mark)//2),logo);image.save(folder/"splash.png")

base=Image.new("RGB",(960,960),(5,7,19));logo=icon(420);base.paste(logo,(270,270),logo);base.save(RES/"drawable"/"splash.png")
print("Generated branded Android launcher and splash assets")
