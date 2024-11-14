# README.md

## Overview

This project is a timeline of events in Disney's Star Wars universe, showcasing movies, TV shows, video games, and more. The data for each timeline entry is stored in a `data.yaml` file, which is parsed and rendered dynamically on the webpage using JavaScript.

This README provides a concise description of every YAML option used in `data.yaml`, explaining how each option works, acceptable values, and how they affect the rendering of the timeline items. This documentation is intended for developers who wish to understand, modify, or extend the data structure for this project.

---

## Table of Contents

1. [YAML File Structure](#yaml-file-structure)
2. [YAML Options Explained](#yaml-options-explained)
   - [title](#title)
   - [date](#date)
   - [image](#image)
   - [media_type](#media_type)
   - [status](#status)
   - [scores](#scores)
     - [type](#type)
     - [score](#score)
     - [source](#source)
   - [description](#description)
3. [Adding New Entries](#adding-new-entries)
4. [Extending the Data Structure](#extending-the-data-structure)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)
7. [Conclusion](#conclusion)

---

## YAML File Structure

The `data.yaml` file contains a list of entries, each representing a timeline item. Each entry is a YAML object with several key-value pairs defining the properties of that item.

**Example Structure:**

```yaml
- title: "Example Title"
  date: "YYYY-MM-DD"
  image: "path/to/image.jpg"
  media_type: "Type of Media"
  status: "Status of the Item"
  scores:
    - type: "Score Type"
      score: "Score Value"
      source: "URL to the Source"
  description: "Brief description of the item."
```

---

## YAML Options Explained

### **title**

- **Type:** String
- **Required:** Yes

The `title` specifies the name of the timeline item, displayed prominently at the top of each entry.

**Example:**

```yaml
title: "Star Wars: The Force Awakens"
```

---

### **date**

- **Type:** String (Date in `YYYY-MM-DD` format)
- **Required:** Yes

The `date` indicates the release or significant date associated with the item. It's used for sorting entries and displayed with the media type.

**Example:**

```yaml
date: "2015-12-18"
```

---

### **image**

- **Type:** String (File path or URL)
- **Required:** No (Recommended)

The `image` is the path to an image representing the item, displayed within the entry.

**Example:**

```yaml
image: "images/forceawakens.jpg"
```

---

### **media_type**

- **Type:** String
- **Required:** Yes

Describes the type of media, such as "Movie," "TV Show," "Video Game," etc.

**Example:**

```yaml
media_type: "Movie"
```

---

### **status**

- **Type:** String
- **Required:** Yes

Indicates the current status of the item, used to determine the status icon.

**Acceptable Values:**

- `"Released"`
- `"Unreleased"`
- `"Partially Completed"`
- `"Cancelled"`

**Example:**

```yaml
status: "Released"
```

---

### **scores**

- **Type:** List of Objects
- **Required:** No

A list of score entries representing ratings from different sources.

**Structure:**

```yaml
scores:
  - type: "Score Type"
    score: "Score Value"
    source: "URL to the Source"
```

**Example:**

```yaml
scores:
  - type: "Rotten Tomatoes Critics"
    score: "93%"
    source: "https://www.rottentomatoes.com/..."
  - type: "Metacritic"
    score: "80"
    source: "https://www.metacritic.com/..."
```

#### **type**

- **Type:** String
- **Required:** Yes

Specifies the name of the rating source.

**Example:**

```yaml
type: "Rotten Tomatoes Critics"
```

#### **score**

- **Type:** String
- **Required:** Yes

Specifies the rating value.

**Example:**

```yaml
score: "93%"
```

#### **source**

- **Type:** String (URL)
- **Required:** No (Recommended)

URL to the original source of the rating. Makes the score box clickable.

**Example:**

```yaml
source: "https://www.rottentomatoes.com/..."
```

---

### **description**

- **Type:** String
- **Required:** No

Provides a brief summary or additional information about the item.

**Example:**

```yaml
description: "The first installment of the sequel trilogy."
```

---

## Adding New Entries

1. **Create a New Entry:**

```yaml
- title: "New Star Wars Project"
  date: "2025-05-04"
  media_type: "Movie"
  status: "Unreleased"
  # Optional fields...
```

2. **Add Optional Fields as Needed:**

Include `image`, `scores`, and `description` if applicable.

3. **Ensure Proper Indentation:**

Use **2 spaces** for each indentation level. Do not use tabs.

---

## Extending the Data Structure

- **Adding New Fields:**

Simply add a new key-value pair under the entry.

```yaml
director: "J.J. Abrams"
```

- **Adding More Score Types:**

Include additional score entries in the `scores` list.

- **Supporting Additional Statuses:**

Update the `getStatusIconHTML` function in `script.js` to handle new statuses.

---

## Best Practices

- **Consistent Formatting:**

  - Use consistent indentation (2 spaces).
  - Enclose strings with special characters in double quotes.

- **Valid URLs:**

  - Ensure all URLs in the `source` fields are correct.

- **Icon Naming Convention:**

  - Icons should be named based on the `type` field, converted to lowercase, spaces replaced with underscores, and special characters removed.
  - Example: `"Rotten Tomatoes Critics"` → `rotten_tomatoes_critics.png`

- **Image Optimization:**

  - Use appropriately sized images to reduce load times.

---

## Troubleshooting

- **YAML Parsing Errors:**

  - **Symptoms:** Timeline doesn't load; errors appear in the console.
  - **Solution:** Check `data.yaml` for syntax errors using a YAML validator.

- **Incorrect or Missing Icons:**

  - **Symptoms:** Icons do not appear for scores or statuses.
  - **Solution:** Ensure icons are correctly named and placed in the appropriate folders.

- **Broken Images:**

  - **Symptoms:** Images do not display.
  - **Solution:** Check that the `image` paths are correct and files exist.

---

## Conclusion

Understanding the YAML options in `data.yaml` is essential for maintaining and extending the timeline project. Each option affects how timeline items are displayed and interacted with on the webpage.

By following the guidelines and best practices in this README, developers can confidently add new entries, customize existing ones, and extend the data structure as needed. Always test changes thoroughly and validate the YAML to prevent parsing errors.

---
