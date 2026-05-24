document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter-value]");
  if (!button) return;

  const group = button.closest("[data-filter-scope]");
  if (!group) return;

  const scope = group.dataset.filterScope;
  const criterion = button.dataset.filterCriterion;
  const value = button.dataset.filterValue;
  const container = document.querySelector(`[data-record-container="${scope}"]`);
  if (!container) return;

  group.querySelectorAll("[data-filter-value]").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");

  const activeFilters = [...document.querySelectorAll(`[data-filter-scope="${scope}"] .filter-button.active`)]
    .map((item) => ({
      criterion: item.dataset.filterCriterion,
      value: item.dataset.filterValue,
    }))
    .filter((item) => item.criterion && item.value && item.value !== "all");

  container.querySelectorAll("[data-record]").forEach((record) => {
    const visible = activeFilters.every((filter) => {
      const recordValue = record.dataset[filter.criterion] || "";
      return recordValue.split(" ").includes(filter.value) || recordValue === filter.value;
    });
    record.hidden = !visible;
  });
});

document.querySelectorAll(".portrait-fallback").forEach((fallback) => {
  fallback.style.display = "none";
});
