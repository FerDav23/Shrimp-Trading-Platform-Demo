# Solución de Problemas - Página en Blanco

## Diagnóstico Rápido

### 1. Verifica que el servidor esté corriendo

En la terminal donde ejecutaste `npm run dev`, deberías ver algo como:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Si no ves esto, el servidor no se inició correctamente.

### 2. Verifica la consola del navegador

1. Abre `http://localhost:5173` en tu navegador
2. Presiona F12 para abrir las herramientas de desarrollador
3. Ve a la pestaña "Console"
4. Busca errores en rojo

Errores comunes:
- **"Failed to resolve module"** → Dependencias no instaladas → Ejecuta `npm install`
- **"Cannot find module"** → Archivo faltante o ruta incorrecta
- **"Uncaught ReferenceError"** → Error de JavaScript

### 3. Verifica la pestaña Network

1. En las herramientas de desarrollador, ve a "Network"
2. Recarga la página (F5)
3. Busca archivos con estado 404 (no encontrado) o 500 (error del servidor)

### 4. Pasos de solución

#### Paso 1: Instalar dependencias
```bash
npm install
```

#### Paso 2: Limpiar y reinstalar (si el paso 1 no funciona)
```bash
# En Windows PowerShell:
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

#### Paso 3: Verificar errores de TypeScript
```bash
npm run build
```

Si hay errores, corrígelos antes de continuar.

#### Paso 4: Ejecutar el servidor de desarrollo
```bash
npm run dev
```

#### Paso 5: Verificar en el navegador
1. Abre `http://localhost:5173`
2. Deberías ver la página de login con 4 tarjetas de usuarios
3. Si está en blanco, abre la consola (F12) y comparte los errores

### 5. Verificación del código

Si todo lo anterior está bien pero aún no funciona, verifica:

1. **Archivo `index.html` existe** en la raíz del proyecto
2. **Archivo `src/main.tsx` existe** y tiene el código correcto
3. **Archivo `src/App.tsx` existe** y exporta el componente App
4. **No hay errores de sintaxis** en los archivos TypeScript

### 6. Prueba mínima

Crea un archivo `src/App.tsx` temporal con esto para verificar:

```tsx
function App() {
  return <div>Hola Mundo</div>;
}

export default App;
```

Si esto funciona, el problema está en el código de la aplicación. Si no funciona, el problema está en la configuración de Vite.
