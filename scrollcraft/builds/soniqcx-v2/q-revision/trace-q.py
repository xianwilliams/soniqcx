"""Vectorize the supplied SONIQCX Q with the installed Potrace library."""
from pathlib import Path
from PIL import Image
import ctypes as C

class Point(C.Structure):_fields_=[('x',C.c_double),('y',C.c_double)]
class Bitmap(C.Structure):_fields_=[('w',C.c_int),('h',C.c_int),('dy',C.c_int),('map',C.POINTER(C.c_ulong))]
class Curve(C.Structure):_fields_=[('n',C.c_int),('tag',C.POINTER(C.c_int)),('c',C.POINTER(Point*3))]
class PathData(C.Structure):pass
PathData._fields_=[('area',C.c_int),('sign',C.c_int),('curve',Curve),('next',C.POINTER(PathData)),('childlist',C.POINTER(PathData)),('sibling',C.POINTER(PathData)),('priv',C.c_void_p)]
class State(C.Structure):_fields_=[('status',C.c_int),('plist',C.POINTER(PathData)),('priv',C.c_void_p)]
lib=C.CDLL('libpotrace.so.0')
lib.potrace_param_default.restype=C.c_void_p
lib.potrace_trace.argtypes=[C.c_void_p,C.POINTER(Bitmap)];lib.potrace_trace.restype=C.POINTER(State)
lib.potrace_state_free.argtypes=[C.POINTER(State)];lib.potrace_param_free.argtypes=[C.c_void_p]
im=Image.open('public/assets/submark.webp').convert('RGBA');w,h=im.size
alpha=im.getchannel('A');print('Source',im.size,'alpha',alpha.getextrema())
stride=(w+63)//64;buf=(C.c_ulong*(h*stride))()
for y in range(h):
 for x in range(w):
  if alpha.getpixel((x,y))>128:buf[y*stride+x//64]|=1<<(63-x%64)
bm=Bitmap(w,h,stride,buf);param=lib.potrace_param_default();state=lib.potrace_trace(param,C.byref(bm));assert state and state.contents.status==0
paths=[];p=state.contents.plist
xy=lambda p:f'{p.x:.3f},{p.y:.3f}'
while p:
 path=p.contents;curve=path.curve;bits=['M'+xy(curve.c[curve.n-1][2])]
 for i in range(curve.n):
  points=curve.c[i]
  if curve.tag[i]==1:bits+=['C'+xy(points[0])+' '+xy(points[1])+' '+xy(points[2])]
  else:bits+=['L'+xy(points[1])+' '+xy(points[2])]
 bits+=['Z'];paths.append(' '.join(bits));print('Contour:',path.area,'segments:',curve.n)
 p=path.next
combined=' '.join(paths)
Path('app/q-mark.ts').write_text('// Smooth vector trace of the supplied SONIQCX submark. Preserve the silhouette.\nexport const Q_PATH = '+repr(combined)+';\n')
Path('public/assets/q-mark.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}"><path fill="#61abbc" fill-rule="evenodd" d="{combined}"/></svg>')
lib.potrace_state_free(state);lib.potrace_param_free(param)
