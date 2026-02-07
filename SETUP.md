# Guía de Configuración

## Pasos para ejecutar el proyecto

1. **Instalar dependencias** (si no lo has hecho):
   ```bash
   npm install
   ```

2. **Ejecutar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

3. **Abrir el navegador**:
   - El servidor debería abrir automáticamente en `http://localhost:5173`
   - Si no se abre automáticamente, ve manualmente a esa URL

## Solución de problemas

### Si no aparece nada en el navegador:

1. **Verifica la consola del navegador** (F12):
   - Abre las herramientas de desarrollador
   - Ve a la pestaña "Console"
   - Busca errores en rojo

2. **Verifica la terminal**:
   - Deberías ver un mensaje como: `VITE v5.x.x ready in xxx ms`
   - Y una URL: `➜  Local:   http://localhost:5173/`

3. **Verifica que las dependencias estén instaladas**:
   ```bash
   npm list --depth=0
   ```
   Deberías ver todas las dependencias listadas.

4. **Si hay errores de compilación**:
   ```bash
   npm run build
   ```
   Esto te mostrará errores de TypeScript si los hay.

5. **Limpia la caché y reinstala**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   ```

## Verificación rápida

Si ejecutas `npm run dev` y ves:
- ✅ Un mensaje de "VITE ready"
- ✅ Una URL local (http://localhost:5173)
- ✅ Pero la página está en blanco

Entonces el problema está en el código del navegador. Abre la consola del navegador (F12) para ver los errores.
