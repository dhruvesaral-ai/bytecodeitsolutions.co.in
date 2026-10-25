interface TrainingProps {
  heading: string;
  subheading: string;
}

export default function Training({ heading, subheading }: TrainingProps) {
  return (
    <section>
      {heading.includes("<") ? (
        <h1
          className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl"
          dangerouslySetInnerHTML={{ __html: heading }}
        />
      ) : (
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
          {heading}
        </h1>
      )}
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-lg">
        {subheading}
      </p>
    </section>
  );
}
  