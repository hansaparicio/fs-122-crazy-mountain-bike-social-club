export const POI_SRC = {
  fuel: "poi-fuel-src",
  food: "poi-food-src",
  hospital: "poi-hospital-src",
  bike: "poi-bike-src",
};

export const POI_LYR = {
  fuel: "poi-fuel-lyr",
  food: "poi-food-lyr",
  hospital: "poi-hospital-lyr",
  bike: "poi-bike-lyr",
};

const colorByKey = (key) => {
  if (key === "fuel") return "#F59E0B";
  if (key === "food") return "#10B981";
  if (key === "hospital") return "#EF4444";
  return "#38128f";
};

const toPointFC = (items = []) => {
  if (!Array.isArray(items) || items.length === 0) {
    return { type: "FeatureCollection", features: [] };
  }

  return {
    type: "FeatureCollection",
    features: items.map((it) => ({
      type: "Feature",
      properties: { id: it.id, name: it.name },
      geometry: {
        type: "Point",
        coordinates: [it.lon, it.lat],
      },
    })),
  };
};

export const upsertNearbyServicesLayers = (map, services) => {
  if (!map || !services) return;

  ["fuel", "food", "hospital", "bike"].forEach((key) => {
    const srcId = POI_SRC[key];
    const layerId = POI_LYR[key];

    if (!srcId || !layerId) return;

    const fc = toPointFC(services[key]);

    const source = map.getSource(srcId);
    if (!source) {
      map.addSource(srcId, { type: "geojson", data: fc });
    }

    if (source) {
      source.setData(fc);
    }

    if (map.getLayer(layerId)) return;

    map.addLayer({
      id: layerId,
      type: "circle",
      source: srcId,
      paint: {
        "circle-radius": 6,
        "circle-opacity": 0.9,
        "circle-color": colorByKey(key),
        "circle-stroke-width": 2,
        "circle-stroke-color": "#111827",
      },
    });
  });
};

export const removeNearbyServicesLayers = (map) => {
  if (!map) return;

  ["fuel", "food", "hospital", "bike"].forEach((key) => {
    const layerId = POI_LYR[key];
    const srcId = POI_SRC[key];

    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }

    if (map.getSource(srcId)) {
      map.removeSource(srcId);
    }
  });
};
