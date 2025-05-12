import { createStyles, css } from "antd-style";

export const useStyles = createStyles({
  container: css`
    width: 100%;
    max-width: 56rem;
    margin: 1rem auto;
    background-color: white;
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    border: 1px solid #dbeafe;

    @media (max-width: 768px) {
      padding: 1rem;
      margin: 0.5rem auto;
    }

    @media (max-width: 480px) {
      padding: 0.75rem;
      margin: 0.25rem auto;
    }
  `,
  title: css`
    font-size: 1.875rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 2rem;
    color: rgb(235, 37, 106);

    @media (max-width: 768px) {
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
    }

    @media (max-width: 480px) {
      font-size: 1.25rem;
      margin-bottom: 1rem;
    }
  `,
  form: css`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    @media (max-width: 768px) {
      gap: 1.25rem;
    }

    @media (max-width: 480px) {
      gap: 1rem;
    }
  `,
  label: css`
    display: block;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: rgb(216, 29, 85);

    @media (max-width: 480px) {
      margin-bottom: 0.25rem;
      font-size: 0.9rem;
    }
  `,
  fileInputContainer: css`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;

    @media (max-width: 480px) {
      gap: 0.25rem;
    }
  `,
  fileInputLabel: css`
    background-color: rgb(235, 37, 80);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: rgb(216, 29, 79);
    }

    @media (max-width: 768px) {
      padding: 0.375rem 0.75rem;
      font-size: 0.9rem;
    }

    @media (max-width: 480px) {
      padding: 0.25rem 0.5rem;
      font-size: 0.8rem;
    }
  `,
  fileInputText: css`
    margin-left: 0.75rem;
    color: #4b5563;

    @media (max-width: 768px) {
      margin-left: 0.5rem;
      font-size: 0.9rem;
    }

    @media (max-width: 480px) {
      margin-left: 0.25rem;
      font-size: 0.8rem;
    }
  `,
  fileInput: css`
    display: none;
  `,
  previewContainer: css`
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: rgb(216, 29, 79);

    @media (max-width: 480px) {
      margin-bottom: 0.25rem;
      font-size: 0.9rem;
    }
  `,
  previewImage: css`
    max-height: 16rem;
    max-width: 100%;
    border-radius: 0.375rem;
    border: 1px solidrgb(254, 191, 195);

    @media (max-width: 768px) {
      max-height: 12rem;
    }

    @media (max-width: 480px) {
      max-height: 10rem;
    }
  `,
  textarea: css`
    width: 100%;
    border: 1px solidrgb(254, 191, 235);
    padding: 0.75rem;
    border-radius: 0.375rem;
    height: 8rem;
    background-color:rgb(255, 239, 254);
    outline: none;
    font-size: 1rem;

    &:focus {
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }

    @media (max-width: 768px) {
      padding: 0.5rem;
      height: 6rem;
      font-size: 0.9rem;
    }

    @media (max-width: 480px) {
      padding: 0.375rem;
      height: 5rem;
      font-size: 0.8rem;
    }
  `,
  button: css`
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    font-weight: 500;
    color: white;
    background-color: rgb(235, 37, 103);
    cursor: pointer;
    border: none;
    transition: background-color 0.2s;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    font-size: 1rem;

    &:hover {
      background-color: rgb(216, 29, 79);
    }

    &:disabled {
      background-color: rgb(253, 147, 191);
      cursor: not-allowed;
      box-shadow: none;
    }

    @media (max-width: 768px) {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
    }

    @media (max-width: 480px) {
      padding: 0.375rem 0.75rem;
      font-size: 0.8rem;
      width: 100%;
    }
  `,
  // Added the missing errorContainer style
  errorContainer: css`
    margin-top: 1rem;
    padding: 0.5rem;
    border-radius: 0.375rem;
    background-color: #fee2e2;
    border: 1px solid #fecaca;

    @media (max-width: 768px) {
      margin-top: 0.75rem;
    }

    @media (max-width: 480px) {
      margin-top: 0.5rem;
    }
  `,
  errorMessage: css`
    margin-top: 1rem;
    color: #dc2626;
    background-color: #fee2e2;
    padding: 0.75rem;
    border-radius: 0.375rem;
    border: 1px solid #fecaca;
    font-size: 1rem;

    @media (max-width: 768px) {
      margin-top: 0.75rem;
      padding: 0.5rem;
      font-size: 0.9rem;
    }

    @media (max-width: 480px) {
      margin-top: 0.5rem;
      padding: 0.375rem;
      font-size: 0.8rem;
    }
  `,
  analysisContainer: css`
    margin-top: 1.5rem;
    padding: 1.25rem;
    border: 1px solidrgb(254, 191, 237);
    border-radius: 0.375rem;
    background-color: #eff6ff;

    @media (max-width: 768px) {
      margin-top: 1.25rem;
      padding: 1rem;
    }

    @media (max-width: 480px) {
      margin-top: 1rem;
      padding: 0.75rem;
    }
  `,
  analysisTitle: css`
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: rgb(235, 37, 90);

    @media (max-width: 768px) {
      font-size: 1.125rem;
      margin-bottom: 0.5rem;
    }

    @media (max-width: 480px) {
      font-size: 1rem;
      margin-bottom: 0.375rem;
    }
  `,

  analysisContent: css`
    margin: 1rem 0;

    @media (max-width: 768px) {
      margin: 0.75rem 0;
    }

    @media (max-width: 480px) {
      margin: 0.5rem 0;
    }
  `,
  analysisText: css`
    color: #374151;
    white-space: pre-line;
    font-size: 1rem;

    @media (max-width: 768px) {
      font-size: 0.9rem;
    }

    @media (max-width: 480px) {
      font-size: 0.8rem;
    }
  `,
  disclaimer: css`
    margin-top: 1rem;
    background-color: #dbeafe;
    padding: 1rem;
    border: 1px solidrgb(254, 191, 225);
    border-radius: 0.375rem;

    @media (max-width: 768px) {
      margin-top: 0.75rem;
      padding: 0.75rem;
    }

    @media (max-width: 480px) {
      margin-top: 0.5rem;
      padding: 0.5rem;
    }
  `,
  disclaimerText: css`
    font-size: 0.875rem;
    color: rgb(175, 30, 78);

    @media (max-width: 768px) {
      font-size: 0.8rem;
    }

    @media (max-width: 480px) {
      font-size: 0.75rem;
    }
  `,
  buttonContainer: css`
    display: flex;
    justify-content: flex-start;
    margin-top: 1rem;

    @media (max-width: 480px) {
      flex-direction: column;
      gap: 0.5rem;
    }
  `,
});
