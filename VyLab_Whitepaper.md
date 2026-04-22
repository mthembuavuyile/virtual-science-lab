# VyLab – Full Platform Overview Document

> **Brand Hierarchy**
> * **Vylex:** The parent technology company focused on public and enterprise SaaS products.
> * **Vylex Nexys:** A dedicated sub-brand and division of Vylex focused entirely on the education, research, development, and innovation sectors.
> * **VyLab:** The flagship digital science laboratory platform built by Vylex Nexys.

## 1. Overview & Vision

**VyLab** is a modern, South African edtech platform designed to give high school learners access to a virtual science laboratory directly from their browser. Built specifically around the **CAPS (Curriculum and Assessment Policy Statement)** Physical Sciences syllabus (Grades 10–12), VyLab ensures that all simulations directly support classroom learning outcomes and exam preparation.

The platform is built with a clear mission: **to democratize access to high-quality STEM education in South Africa.** It eliminates the need for expensive laboratory equipment, provides safe and repeatable experiment environments, and supports underserved schools with limited physical resources.

---

## 2. Platform Architecture & Technical Reality

VyLab is designed for maximum accessibility and simplicity. Despite what traditional "virtual lab" marketing might suggest, VyLab does not rely on complex cloud-native infrastructure provisioning or isolated compute environments.

* **Browser-Based Static App:** VyLab is a static frontend application built with **React** and **TypeScript**. It requires no installation and runs entirely in the user's browser tab.
* **Local Processing:** Every simulation is a JavaScript calculation running locally on the user's device. When a learner adjusts a variable (e.g., voltage in a circuit), the app recalculates the data and rerenders the UI instantly. No backend server is involved in the experiments, allowing it to perform well even on low-resource devices.
* **External Dependencies:** The only external network call the application makes is to the language model endpoint powering the AI Syllabus Tutor. The simulators, notebook, and unit navigation are fully local once loaded.

---

## 3. Core Platform Features

* **Interactive Science Simulators:** Dynamic environments where learners manipulate variables and observe outcomes in real-time. These simulations generate live scientific data, allowing students to analyze graphs, understand cause-and-effect, and perform virtual data collection.
* **AI Syllabus Tutor:** An integrated AI assistant trained specifically on CAPS Physical Sciences guidelines. It can answer questions in plain language, explain complex concepts (like Newton's Second Law or stoichiometry) step-by-step, and assist with exam preparation.
* **Session Notebook:** A built-in digital notebook where learners can record observations, save notes automatically to their device, and document findings exactly as they would in a physical lab book.

---

## 4. Chemistry Laboratory Capabilities

The Chemistry section contains seven CAPS-aligned units. All units are tagged by difficulty (Standard, High, or Critical) to guide learners.

| Unit | Topic | Key Concepts & Interactive Features |
| :--- | :--- | :--- |
| **1** | **Organic Compounds & Macromolecules** | Explores physical/chemical properties based on molecular size and intermolecular forces. Includes solubility testing, boiling point comparisons, viscosity, and reaction behaviors (combustion, esterification, bromine water test). |
| **2** | **Rate & Extent of Reactions** | Demonstrates collision theory. Learners adjust temperature, concentration, surface area, and catalysts to observe effects on reaction progress via animated particle collisions and real-time kinetic energy tracking. |
| **3** | **Chemical Equilibrium** | Demonstrates Le Châtelier's principle. Dynamic equilibrium shifting using real examples like the cobalt chloride color change (pink/blue), iron thiocyanate, and nitrogen dioxide systems. |
| **4** | **Acids & Bases** *(Critical Difficulty)* | Features a full titration simulator. Learners control flow rates from a burette, watch live pH titration curves, detect equivalence points, and test indicators (phenolphthalein, methyl orange, litmus). |
| **5** | **Electrochemistry** | Covers galvanic and electrolytic cells. Learners build cells by selecting electrodes (lithium to gold), measure live voltage outputs (EMF), and observe oxidation/reduction processes and electron flow. |
| **6** | **Chlor-Alkali Industry** | Models the industrial membrane cell process for brine electrolysis. Tracks the production of chlorine gas, hydrogen gas, and sodium hydroxide, connecting chemistry to real-world industrial applications. |
| **7** | **Fertilisers & Soil Science** | Covers NPK macronutrient analysis and plant growth modeling. Learners analyze soil types (sandy, loam, clay) and study the industrial production of fertilizers (Haber and Ostwald processes). |

---

## 5. Physics Laboratory Capabilities

The Physics section currently features two flagship simulators tailored for Grades 10–12, with room for future expansion.

### Ohm’s Law Circuit
Learners build a simple circuit and adjust parameters to visualize electrical relationships dynamically.
* **Configurable Variables:** Voltage (V), Resistance (Ω).
* **Live Outputs:** The system automatically calculates Current (I = V / R) and Power (P = V × I), updating a visual circuit diagram in real time.

### Projectile Motion Simulation
Makes abstract 2D kinematics visually intuitive by allowing learners to model trajectories.
* **Configurable Variables:** Initial velocity, launch angle, and gravity (Earth's 9.8 m/s² or custom environments).
* **Live Outputs:** Calculates maximum height, range, and flight time, plotting the full parabolic trajectory on a 2D graph.

---

## 6. Target Audience & Value Proposition

**Who it is for:**
* High school learners (Grades 10–12) studying Physical Sciences.
* Teachers and STEM educators.
* Schools and STEM-focused institutions with limited physical lab infrastructure.

**Value for Schools:**
VyLab provides a highly cost-effective, scalable alternative to physical labs. By offering a safe experimentation environment that requires no chemical consumables or physical hardware upkeep, it ensures that every student gets a complete, curriculum-aligned practical science workflow from a single browser tab.