# 🎓 estudiIA - Frontend (Next.js)

<div align="center">
  <h1>Potencia tu Aprendizaje con IA</h1>
  <p>Una plataforma inteligente diseñada para estudiantes de alto rendimiento que buscan optimizar cada minuto de estudio.</p>
  
  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
</div>

---

## 🌟 ¿Qué es estudiIA?

**estudiIA** no es solo un gestor de documentos; es un **ecosistema de estudio inteligente**. Nuestra misión es transformar materiales de lectura estáticos (PDFs, notas, guías) en experiencias interactivas y dinámicas impulsadas por Inteligencia Artificial.

### El Problema
Los estudiantes modernos se enfrentan a una sobrecarga de información. Leer cientos de páginas de PDFs de forma pasiva es ineficiente y agotador.

### La Solución
estudiIA utiliza RAG (Retrieval-Augmented Generation) y modelos de lenguaje avanzados para permitirte "dialogar" con tus documentos, generar exámenes de práctica personalizados y obtener resúmenes críticos en segundos.

---

## 🔥 Valor y Propósito

*   **Eficiencia Extrema:** Reduce el tiempo de lectura y síntesis hasta en un 70%.
*   **Aprendizaje Activo:** Pasa de la lectura pasiva a la autoevaluación constante con nuestro sistema de exámenes inteligentes.
*   **Centralización Académica:** Todos tus documentos, notas y evaluaciones en un solo workspace profesional.
*   **Enfoque en el Rigor:** Diseñado con una estética minimalista para minimizar distracciones y maximizar el flujo cognitivo.

---

## 📸 Funcionalidades Clave

### 1. Panel de Control (Workspace)
Gestiona tus materias, carpetas y archivos con una interfaz fluida y profesional.
<!-- Placeholder para Imagen: Workspace Grid/List View -->
<div align="center">
  <img src="/public/images/docs/workspace.png" alt="Workspace Screenshot" />
</div>

### 2. Análisis de Documentos con IA
Visualiza tus PDFs y chatea directamente con ellos. Extrae conceptos clave, pide aclaraciones o solicita resúmenes específicos.
<!-- Placeholder para Imagen: PDF Viewer + AI Chat Sidebar -->
<div align="center">
  <img src="/public/images/docs/chat.png" alt="AI Analysis Screenshot" />
</div>

### 3. Generacion de notas
Crea notas basadas en el contenido de tus archivos. Genera explicaciones resumidas que te ayudan a entender conceptos complejos, o resalta los puntos clave de tus documentos. Modifica en tiempo real el contenido de tus notas para adaptarlas a tu estilo de aprendizaje.

<!-- Placeholder para Imagen: Exam UI with Mascot Companion -->
<div align="center">
  <img src="/public/images/docs/note.png" alt="Exam UI Screenshot" />
</div>

### 4. Exámenes de Autoevaluación
Genera exámenes de opción múltiple, verdadero/falso o desarrollo basados exclusivamente en el contenido de tus archivos. Recibe feedback académico inmediato de nuestra mascota guía.
<!-- Placeholder para Imagen: Exam UI with Mascot Companion -->
<div align="center">
  <img src="/public/images/docs/test.png" alt="Exam UI Screenshot" />
</div>
---

## 🛠️ Stack Tecnológico

El frontend de estudiIA está construido con las tecnologías más modernas para garantizar velocidad, SEO y una experiencia de usuario excepcional:

*   **Framework:** [Next.js 15+](https://next.js.org) (App Router)
*   **Estilos:** [Tailwind CSS 4.0](https://tailwindcss.com) + [Shadcn/UI](https://ui.shadcn.com)
*   **Lenguaje:** [TypeScript](https://www.typescriptlang.org)
*   **Estado y Datos:** [TanStack Query (React Query)](https://tanstack.com/query)
*   **Autenticación:** [Better Auth](https://better-auth.com)
*   **IA e Integración:** [Vercel AI SDK](https://sdk.vercel.ai)
*   **Pagos:** [PayPal SDK](https://developer.paypal.com)

---

## 🚀 Comenzando

### Requisitos Previos
*   Node.js 18+ 
*   npm / pnpm / bun

### Instalación

1.  Clona el repositorio:
    ```bash
    git clone https://github.com/tu-usuario/estudiia-front.git
    cd estudiia-front
    ```

2.  Instala las dependencias:
    ```bash
    npm install
    ```

3.  Configura las variables de entorno (`.env`):
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:3000
    # Agrega tus claves de Better Auth y PayPal aquí
    ```

4.  Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```

---

## 📁 Estructura del Proyecto

```text
src/
├── app/            # Rutas (App Router), Layouts y Páginas
│   ├── (main)/     # Vistas principales (Workspace, Dashboard)
│   ├── document/   # Visor de documentos y Chat IA
│   └── exam/       # Interfaz de exámenes y resultados
├── components/     # Componentes de UI reutilizables (Shadcn)
├── hooks/          # Hooks personalizados (useExam, useAuth, etc.)
├── lib/            # Utilidades (axios, cn, formatters)
└── providers/      # Context Providers (QueryClient, Theme, Auth)
```

---

<div align="center">
  <p>Construido con ❤️ para la comunidad estudiantil.</p>
  <p><strong>© 2024 estudiIA - Todos los derechos reservados.</strong></p>
</div>
