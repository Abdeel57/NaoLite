# Guía de Deploy en Netlify para NaoLite

## ✅ Cambios Realizados

1. **package.json actualizado:**
   - Script `build` ahora ejecuta `prisma generate && next build`
   - Agregado script `postinstall` que ejecuta `prisma generate`

2. **netlify.toml creado:**
   - Configuración de build con Node.js 20
   - Plugin de Next.js para Netlify

## 🚀 Pasos para Deploy

### 1. Configurar Variables de Entorno en Netlify

Ve a tu sitio en Netlify → **Site settings** → **Environment variables** y agrega:

```
DATABASE_URL=postgresql://usuario:contraseña@host:puerto/database
```

**IMPORTANTE:** Usa la URL completa de tu base de datos PostgreSQL en producción (Railway, Supabase, etc.)

### 2. Limpiar Caché y Re-deployar

En el dashboard de Netlify:

1. Ve a **Deploys**
2. Haz clic en **Trigger deploy**
3. Selecciona **Clear cache and deploy site**

### 3. Verificar el Build

El build ahora debería:
- ✅ Ejecutar `prisma generate` automáticamente
- ✅ Generar un Prisma Client fresco
- ✅ Compilar Next.js sin errores

## 🔧 Solución de Problemas

### Si el error persiste:

1. **Verifica que DATABASE_URL esté configurada** en las variables de entorno de Netlify
2. **Asegúrate de que la base de datos sea accesible** desde Netlify (no localhost)
3. **Limpia el caché** completamente y re-deploya

### Error de conexión a la base de datos:

Si ves errores de conexión, asegúrate de que:
- La URL de la base de datos incluya `?sslmode=require` al final (para conexiones seguras)
- El host sea público (no `localhost` o IPs privadas)
- Los puertos estén abiertos en tu proveedor de base de datos

### Ejemplo de DATABASE_URL para Railway:

```
DATABASE_URL=postgresql://postgres:contraseña@host.railway.app:puerto/railway?sslmode=require
```

## 📝 Archivos Modificados

- ✅ `package.json` - Scripts actualizados
- ✅ `netlify.toml` - Configuración de Netlify creada
- ✅ Este archivo `NETLIFY_DEPLOY.md` - Documentación

## 🎉 Próximos Pasos

Después del deploy exitoso:
1. Verifica que el sitio cargue correctamente
2. Prueba las funcionalidades principales
3. Revisa los logs en Netlify si hay errores

