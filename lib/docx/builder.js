import {
  Document,
  Packer,
  AlignmentType,
  LevelFormat,
  BorderStyle
} from 'docx';

/**
 * Creates a DOCX document with proper configuration
 * @param {Array} sections - Array of Paragraph/section elements
 * @returns {Promise<Buffer>} - DOCX file buffer
 */
export async function createDocx(sections) {
  // Configure bullet numbering
  const numbering = {
    config: [
      {
        reference: 'bullet-numbering',
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: '\u2022',
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: {
                indent: {
                  left: 360,  // 0.25 inch
                  hanging: 180 // 0.125 inch
                }
              }
            }
          }
        ]
      }
    ]
  };

  // Create document with proper formatting
  const doc = new Document({
    numbering,
    styles: {
      default: {
        document: {
          run: {
            font: 'Verdana',
            size: 20 // 10pt default
          }
        }
      }
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              width: 11906,  // A4 width in DXA
              height: 16838 // A4 height in DXA
            },
            margin: {
              top: 1080,    // 0.75 inch
              right: 1080,
              bottom: 1080,
              left: 1080
            }
          }
        },
        children: Array.isArray(sections) ? sections : [sections]
      }
    ]
  });

  return await Packer.toBuffer(doc);
}

/**
 * Formats a date string from YYYY-MM format to "Mon YYYY"
 */
export function formatDate(dateStr) {
  if (!dateStr || dateStr === 'Present') return 'Present';

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  try {
    const [year, month] = dateStr.split('-');
    const monthNum = parseInt(month) - 1;
    return `${months[monthNum] || dateStr} ${year}`;
  } catch {
    return dateStr;
  }
}

/**
 * Safely get nested object values
 */
export function safeGet(obj, path, defaultValue = '') {
  return path.split('.').reduce((acc, part) => acc?.[part], obj) || defaultValue;
}

/**
 * Flatten and deduplicate arrays
 */
export function flattenArray(arr) {
  return [...new Set(Array.isArray(arr) ? arr.flat() : [arr])].filter(Boolean);
}
